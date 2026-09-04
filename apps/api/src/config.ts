export interface Config {
  port: number;
  dbDriver: 'auto' | 'firebase' | 'postgres' | 'sqlite';
  pgHost: string;
  pgPort: number;
  pgDatabase: string;
  pgUser: string;
  pgPassword: string;
  sqlitePath: string;
  // Firebase configuration
  firebaseProjectId?: string;
  firebaseClientEmail?: string;
  firebasePrivateKey?: string;
  firebaseServiceAccount?: string;
  firebaseDatabaseUrl?: string;
  pgrestUrl: string;
  pgrestApikey: string;
  pgrestAcceptProfile: string;
  corsOrigin: string;
  jwtSecret: string;
  /** Credenciales del admin inicial que se crea si no existe (solo en desarrollo). */
  adminUsername: string;
  adminPassword: string;
}

export function loadConfig(): Config {
  return {
    port: Number(process.env.PORT ?? 8787),
    dbDriver: (process.env.DB_DRIVER as 'auto' | 'firebase' | 'postgres' | 'sqlite') ?? 'auto',
    pgHost: process.env.PGHOST ?? 'localhost',
    pgPort: Number(process.env.PGPORT ?? 5432),
    pgDatabase: process.env.PGDATABASE ?? 'personalidad',
    pgUser: process.env.PGUSER ?? 'postgres',
    pgPassword: process.env.PGPASSWORD ?? 'postgres',
    sqlitePath: process.env.SQLITE_PATH ?? './personalidad.sqlite',
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
    pgrestUrl: process.env.PGREST_URL ?? 'http://localhost:3000',
    pgrestApikey: process.env.PGREST_APIKEY ?? '',
    pgrestAcceptProfile: process.env.PGREST_ACCEPT_PROFILE ?? 'public',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123'
  };
}

