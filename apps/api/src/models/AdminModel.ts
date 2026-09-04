import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { DatabaseAdapter } from '../db/databaseAdapter.js';

export interface StoredAdmin {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface AdminSafe {
  id: string;
  username: string;
  created_at: string;
}

/**
 * Modelo de la entidad Administrador.
 * Encapsula el acceso a datos de administradores vía DatabaseAdapter
 * y el hasheo/verificación de contraseñas (bcrypt).
 */
export class AdminModel {
  constructor(private readonly db: DatabaseAdapter) {}

  async findByUsername(username: string): Promise<StoredAdmin | undefined> {
    return this.db.queryOne<StoredAdmin>(
      'SELECT id, username, password_hash, created_at FROM admins WHERE username = $1',
      [username]
    );
  }

  async findById(id: string): Promise<StoredAdmin | undefined> {
    return this.db.queryOne<StoredAdmin>(
      'SELECT id, username, password_hash, created_at FROM admins WHERE id = $1',
      [id]
    );
  }

  async list(): Promise<AdminSafe[]> {
    return this.db.query<AdminSafe>(
      'SELECT id, username, created_at FROM admins ORDER BY created_at ASC'
    );
  }

  async create(username: string, plainPassword: string): Promise<StoredAdmin[]> {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const id = crypto.randomUUID();
    return this.db.query<StoredAdmin>(
      'INSERT INTO admins (id, username, password_hash) VALUES ($1, $2, $3) RETURNING id, username, password_hash, created_at',
      [id, username, passwordHash]
    );
  }

  async updatePassword(id: string, plainPassword: string): Promise<StoredAdmin[]> {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    return this.db.query<StoredAdmin>(
      'UPDATE admins SET password_hash = $1 WHERE id = $2 RETURNING id, username, password_hash, created_at',
      [passwordHash, id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM admins WHERE id = $1', [id]);
  }

  async verifyCredentials(username: string, plainPassword: string): Promise<StoredAdmin | null> {
    const admin = await this.findByUsername(username);
    if (!admin) return null;
    const ok = await bcrypt.compare(plainPassword, admin.password_hash);
    return ok ? admin : null;
  }
}
