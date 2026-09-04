import type { SessionUser, MBTICode } from '@personalidad/core';
import { computeResult } from '@personalidad/core';
import type { UserModel } from '../models/UserModel.js';
import type { SessionModel } from '../models/SessionModel.js';
import type { ActiveUser, SessionStats, StoredSession } from '../models/SessionModel.js';

export interface ClientInfo {
  userAgent?: string | null;
  ip?: string | null;
}

/**
 * Servicio de Sesiones.
 * Orquesta los modelos para implementar la lógica de negocio del
 * seguimiento de uso: empezar test, latido de actividad y finalizar.
 */
export class SessionService {
  constructor(
    private readonly users: UserModel,
    private readonly sessions: SessionModel
  ) {}

  /** Registra al usuario y abre una nueva sesión de test. */
  async start(user: SessionUser, client: ClientInfo): Promise<StoredSession> {
    const createdUsers = await this.users.createOrFind(user);
    const storedUser = createdUsers[0];

    const created = await this.sessions.create({
      userId: storedUser.id,
      userAgent: client.userAgent ?? null,
      ip: client.ip ?? null
    });

    return created[0];
  }

  /** Envía un "latido" para mantener al usuario como online. */
  async heartbeat(sessionId: string): Promise<StoredSession | undefined> {
    const updated = await this.sessions.updateActivity(sessionId, {});
    return updated[0];
  }

  /** Marca la sesión como completada con el código MBTI y puntajes. */
  async complete(sessionId: string, answers: Record<number, 'A' | 'B'>): Promise<StoredSession | undefined> {
    const result = computeResult(answers);
    const updated = await this.sessions.updateActivity(sessionId, {
      status: 'completed',
      personalityCode: result.code,
      completedAt: new Date().toISOString()
    });
    return updated[0];
  }

  async onlineUsers(): Promise<ActiveUser[]> {
    return this.sessions.activeUsers();
  }

  async getStats(): Promise<SessionStats> {
    return this.sessions.stats();
  }
}

export type { ActiveUser, MBTICode, SessionStats };
