import crypto from 'node:crypto';
import type { DatabaseAdapter } from '../db/databaseAdapter.js';
import type { MBTICode } from '@personalidad/core';

export interface StoredSession {
  id: string;
  user_id: string | null;
  status: 'started' | 'completed';
  personality_code: MBTICode | null;
  started_at: string;
  completed_at: string | null;
  last_active_at: string;
  user_agent: string | null;
  ip: string | null;
}

export interface ActiveUser {
  user_id: string;
  name: string;
  email: string | null;
  session_id: string;
  status: string;
  personality_code: string | null;
  last_active_at: string;
}

export interface SessionStats {
  completed_count: number;
  started_count: number;
  unique_users: number;
  online_count: number;
}

export interface CreateSessionInput {
  userId: string;
  status?: 'started' | 'completed';
  personalityCode?: MBTICode | null;
  userAgent?: string | null;
  ip?: string | null;
}

export interface SessionWithUser extends StoredSession {
  user?: { id: string; name: string; email: string | null };
}

export interface PersonalityCount {
  personality_code: string | null;
  count: number;
}

/**
 * Modelo de la entidad Sesión de Test.
 * Encapsula la persistencia del seguimiento de uso de la web.
 */
export class SessionModel {
  constructor(private readonly db: DatabaseAdapter) {}

  async create(input: CreateSessionInput): Promise<StoredSession[]> {
    const id = crypto.randomUUID();
    return this.db.query<StoredSession>(
      `INSERT INTO test_sessions (id, user_id, status, personality_code, user_agent, ip)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, status, personality_code, started_at, completed_at, last_active_at, user_agent, ip`,
      [
        id,
        input.userId,
        input.status ?? 'started',
        input.personalityCode ?? null,
        input.userAgent ?? null,
        input.ip ?? null
      ]
    );
  }

  /** Registra actividad (latido) y, opcionalmente, finalización. */
  async updateActivity(
    id: string,
    patch: { status?: 'completed'; personalityCode?: MBTICode; completedAt?: string }
  ): Promise<StoredSession[]> {
    const sets: string[] = [];
    const params: any[] = [];
    let idx = 1;

    const nowIso = new Date().toISOString();
    sets.push(`last_active_at = $${idx++}`);
    params.push(nowIso);

    if (patch.status) {
      sets.push(`status = $${idx++}`);
      params.push(patch.status);
    }
    if (patch.personalityCode) {
      sets.push(`personality_code = $${idx++}`);
      params.push(patch.personalityCode);
    }
    if (patch.completedAt) {
      sets.push(`completed_at = $${idx++}`);
      params.push(patch.completedAt);
    }

    params.push(id);
    const sql = `UPDATE test_sessions SET ${sets.join(', ')} WHERE id = $${idx}
      RETURNING id, user_id, status, personality_code, started_at, completed_at, last_active_at, user_agent, ip`;

    return this.db.query<StoredSession>(sql, params);
  }

  /** Usuarios con actividad reciente (online en los últimos 5 minutos). */
  async activeUsers(): Promise<ActiveUser[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    return this.db.query<ActiveUser>(
      `SELECT DISTINCT
        u.id AS user_id,
        u.name,
        u.email,
        s.id AS session_id,
        s.status,
        s.personality_code,
        s.last_active_at
      FROM test_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.last_active_at > $1
      ORDER BY s.last_active_at DESC`,
      [fiveMinutesAgo]
    );
  }

  /** Estadísticas agregadas de uso. */
  async stats(): Promise<SessionStats> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const row = await this.db.queryOne<any>(
      `SELECT
        COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed_count,
        COALESCE(SUM(CASE WHEN status = 'started' THEN 1 ELSE 0 END), 0) AS started_count,
        COUNT(DISTINCT user_id) AS unique_users,
        COALESCE(SUM(CASE WHEN last_active_at > $1 THEN 1 ELSE 0 END), 0) AS online_count
      FROM test_sessions`,
      [fiveMinutesAgo]
    );

    return {
      completed_count: Number(row?.completed_count ?? 0),
      started_count: Number(row?.started_count ?? 0),
      unique_users: Number(row?.unique_users ?? 0),
      online_count: Number(row?.online_count ?? 0)
    };
  }

  async findByUserId(userId: string): Promise<StoredSession[]> {
    return this.db.query<StoredSession>(
      'SELECT id, user_id, status, personality_code, started_at, completed_at, last_active_at, user_agent, ip FROM test_sessions WHERE user_id = $1 ORDER BY started_at DESC',
      [userId]
    );
  }

  /** Lista sesiones con los datos del usuario relacionado. */
  async listWithUsers(opts?: { personality?: string; status?: string; limit?: number; offset?: number }): Promise<SessionWithUser[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (opts?.personality) {
      conditions.push(`s.personality_code = $${idx++}`);
      params.push(opts.personality);
    }
    if (opts?.status) {
      conditions.push(`s.status = $${idx++}`);
      params.push(opts.status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    params.push(limit);
    const limitParam = idx++;
    params.push(offset);
    const offsetParam = idx++;

    const sql = `
      SELECT
        s.id,
        s.user_id,
        s.status,
        s.personality_code,
        s.started_at,
        s.completed_at,
        s.last_active_at,
        s.user_agent,
        s.ip,
        u.id AS u_id,
        u.name AS u_name,
        u.email AS u_email
      FROM test_sessions s
      LEFT JOIN users u ON u.id = s.user_id
      ${where}
      ORDER BY s.started_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    const rows = await this.db.query<any>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      status: r.status,
      personality_code: r.personality_code,
      started_at: r.started_at,
      completed_at: r.completed_at,
      last_active_at: r.last_active_at,
      user_agent: r.user_agent,
      ip: r.ip,
      user: r.u_id ? { id: r.u_id, name: r.u_name, email: r.u_email } : undefined
    }));
  }

  async remove(id: string): Promise<void> {
    await this.db.query('DELETE FROM test_sessions WHERE id = $1', [id]);
  }

  async countByPersonality(): Promise<PersonalityCount[]> {
    const rows = await this.db.query<any>(
      `SELECT personality_code, COUNT(*) AS count
       FROM test_sessions
       WHERE personality_code IS NOT NULL
       GROUP BY personality_code
       ORDER BY count DESC`
    );
    return rows.map((r) => ({
      personality_code: r.personality_code,
      count: Number(r.count)
    }));
  }
}
