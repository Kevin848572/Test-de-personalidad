import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import type { Config } from '../config.js';

const { Pool, Client } = pg;

export interface DatabaseAdapter {
  readonly driver: 'postgres' | 'sqlite';
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
  exec(sql: string): Promise<void>;
  initSchema(): Promise<void>;
  close(): Promise<void>;
}

/**
 * Normaliza valores de JavaScript a tipos aceptables por node:sqlite
 * (booleano -> 1/0, objetos/arreglos -> JSON string).
 */
function normalizeSqliteParam(val: unknown): any {
  if (val === undefined || val === null) return null;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object' && !(val instanceof Uint8Array)) {
    return JSON.stringify(val);
  }
  return val;
}

export class SqliteDatabaseAdapter implements DatabaseAdapter {
  readonly driver = 'sqlite' as const;
  private db: DatabaseSync;

  constructor(dbPath: string) {
    this.db = new DatabaseSync(dbPath);
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // Reemplaza $1, $2, etc. por ?
    const convertedSql = sql.replace(/\$\d+/g, '?');
    const normalized = params.map(normalizeSqliteParam);
    const stmt = this.db.prepare(convertedSql);
    try {
      return stmt.all(...normalized) as T[];
    } catch {
      // Si la sentencia no devuelve filas (e.g. exec o DDL), ejecutamos run
      stmt.run(...normalized);
      return [] as T[];
    }
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const rows = await this.query<T>(sql, params);
    return rows[0];
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async initSchema(): Promise<void> {
    this.db.exec(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS test_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed')),
        personality_code TEXT,
        started_at TEXT NOT NULL DEFAULT (datetime('now')),
        completed_at TEXT,
        last_active_at TEXT NOT NULL DEFAULT (datetime('now')),
        user_agent TEXT,
        ip TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_status ON test_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_sessions_started ON test_sessions(started_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON test_sessions(user_id);

      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS personalities (
        code TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        fortalezas TEXT NOT NULL DEFAULT '[]',
        debilidades TEXT NOT NULL DEFAULT '[]',
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY,
        text TEXT NOT NULL,
        "column" INTEGER NOT NULL CHECK ("column" BETWEEN 1 AND 7),
        dim TEXT NOT NULL CHECK (dim IN ('E/I', 'S/N', 'T/F', 'J/P')),
        is_active INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

export class PgDatabaseAdapter implements DatabaseAdapter {
  readonly driver = 'postgres' as const;
  private pool: pg.Pool;

  constructor(private readonly config: Config) {
    this.pool = new Pool({
      host: config.pgHost,
      port: config.pgPort,
      database: config.pgDatabase,
      user: config.pgUser,
      password: config.pgPassword
    });
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await this.pool.query(sql, params);
    return res.rows as T[];
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const rows = await this.query<T>(sql, params);
    return rows[0];
  }

  async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  async initSchema(): Promise<void> {
    // Asegurarse de que la base de datos existe
    try {
      const maintenanceClient = new Client({
        host: this.config.pgHost,
        port: this.config.pgPort,
        user: this.config.pgUser,
        password: this.config.pgPassword,
        database: 'postgres'
      });
      await maintenanceClient.connect();
      const check = await maintenanceClient.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [this.config.pgDatabase]
      );
      if (check.rowCount === 0) {
        await maintenanceClient.query(`CREATE DATABASE "${this.config.pgDatabase}"`);
        console.log(`✨ Base de datos PostgreSQL "${this.config.pgDatabase}" creada con éxito.`);
      }
      await maintenanceClient.end();
    } catch {
      // Si no podemos conectarnos a la BD de mantenimiento, continuamos con el pool
    }

    await this.exec(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        email text,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS test_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        status text NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed')),
        personality_code text,
        started_at timestamptz NOT NULL DEFAULT now(),
        completed_at timestamptz,
        last_active_at timestamptz NOT NULL DEFAULT now(),
        user_agent text,
        ip text
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_status ON test_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_sessions_started ON test_sessions(started_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON test_sessions(user_id);

      CREATE TABLE IF NOT EXISTS admins (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS personalities (
        code text PRIMARY KEY,
        titulo text NOT NULL,
        descripcion text NOT NULL,
        fortalezas jsonb NOT NULL DEFAULT '[]',
        debilidades jsonb NOT NULL DEFAULT '[]',
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS questions (
        id integer PRIMARY KEY,
        text text NOT NULL,
        "column" integer NOT NULL CHECK ("column" BETWEEN 1 AND 7),
        dim text NOT NULL CHECK (dim IN ('E/I', 'S/N', 'T/F', 'J/P')),
        is_active boolean NOT NULL DEFAULT true,
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

/**
 * Fábrica del adaptador de base de datos con recuperación automática (Self-Healing).
 * Si Postgres falla o no está configurado, conmuta automáticamente a SQLite nativo.
 */
export async function createDatabaseAdapter(config: Config): Promise<DatabaseAdapter> {
  if (config.dbDriver === 'sqlite') {
    const adapter = new SqliteDatabaseAdapter(config.sqlitePath);
    await adapter.initSchema();
    console.log(`📁 Base de datos SQLite inicializada en: ${config.sqlitePath}`);
    return adapter;
  }

  if (config.dbDriver === 'postgres') {
    const adapter = new PgDatabaseAdapter(config);
    await adapter.initSchema();
    console.log(`🐘 Conectado a PostgreSQL (${config.pgHost}:${config.pgPort}/${config.pgDatabase})`);
    return adapter;
  }

  // Modo 'auto': intentar PostgreSQL primero, luego fallback a SQLite nativo
  try {
    const pgAdapter = new PgDatabaseAdapter(config);
    await pgAdapter.initSchema();
    // Prueba de consulta
    await pgAdapter.query('SELECT 1');
    console.log(`🐘 Conectado exitosamente a PostgreSQL (${config.pgHost}:${config.pgPort}/${config.pgDatabase})`);
    return pgAdapter;
  } catch (err) {
    console.warn(
      `⚠️ PostgreSQL no disponible (${(err as Error).message}).\n` +
      `🔄 Conmutando automáticamente a base de datos SQLite embebida (${config.sqlitePath})...`
    );
    const sqliteAdapter = new SqliteDatabaseAdapter(config.sqlitePath);
    await sqliteAdapter.initSchema();
    console.log(`✅ Base de datos SQLite lista y operando.`);
    return sqliteAdapter;
  }
}
