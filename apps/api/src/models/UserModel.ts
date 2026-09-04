import crypto from 'node:crypto';
import type { DatabaseAdapter } from '../db/databaseAdapter.js';
import type { SessionUser } from '@personalidad/core';

export interface StoredUser {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
}

/**
 * Modelo de la entidad Usuario.
 * Encapsula todo el acceso a datos / persistencia vía DatabaseAdapter.
 */
export class UserModel {
  constructor(private readonly db: DatabaseAdapter) {}

  /** Crea un usuario (o devuelve el existente por email). */
  async createOrFind(user: SessionUser): Promise<StoredUser[]> {
    if (user.email) {
      const existing = await this.db.query<StoredUser>(
        'SELECT id, name, email, created_at FROM users WHERE email = $1',
        [user.email]
      );
      if (existing.length > 0) return existing;
    }

    const id = crypto.randomUUID();
    return this.db.query<StoredUser>(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [id, user.name, user.email ?? null]
    );
  }

  async findById(id: string): Promise<StoredUser | undefined> {
    return this.db.queryOne<StoredUser>(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );
  }

  /** Lista usuarios con búsqueda por nombre/email y paginación. */
  async list(opts?: { search?: string; limit?: number; offset?: number }): Promise<StoredUser[]> {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    if (opts?.search && opts.search.trim()) {
      const term = `%${opts.search.trim().toLowerCase()}%`;
      return this.db.query<StoredUser>(
        'SELECT id, name, email, created_at FROM users WHERE (LOWER(name) LIKE $1 OR LOWER(COALESCE(email, \'\')) LIKE $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [term, limit, offset]
      );
    }

    return this.db.query<StoredUser>(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
  }

  async count(): Promise<number> {
    const row = await this.db.queryOne<{ count: string | number }>(
      'SELECT count(*) as count FROM users'
    );
    return Number(row?.count ?? 0);
  }

  async remove(id: string): Promise<void> {
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
