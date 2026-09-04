import type { Context } from 'hono';
import type { SessionService } from '../services/SessionService.js';

/**
 * Controlador de Sesiones.
 * Recibe las peticiones HTTP, valida entrada, delega en el servicio
 * y devuelve la respuesta formateada.
 */
export class SessionController {
  constructor(private readonly service: SessionService) {}

  /** Crea usuario + sesión al iniciar el test. */
  async start(c: Context) {
    const body = await c.req.json().catch(() => null);

    const name: unknown = body?.name;
    if (typeof name !== 'string' || !name.trim()) {
      return c.json({ error: 'El nombre es obligatorio' }, 400);
    }

    const email: unknown = body?.email;
    if (email !== undefined && email !== null && email !== '') {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return c.json({ error: 'Correo electrónico inválido' }, 400);
      }
    }

    const session = await this.service.start(
      { name: name.trim(), email: typeof email === 'string' ? email.trim() : undefined },
      {
        userAgent: c.req.header('user-agent')?.slice(0, 500) ?? null,
        ip: c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? null
      }
    );

    return c.json({ sessionId: session.id }, 201);
  }

  /** Última actividad del usuario (está online). */
  async heartbeat(c: Context) {
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Falta id de sesión' }, 400);

    const updated = await this.service.heartbeat(id);
    if (!updated) return c.json({ error: 'Sesión no encontrada' }, 404);
    return c.json({ ok: true, lastActiveAt: updated.last_active_at });
  }

  /** Finaliza el test y guarda el resultado. */
  async complete(c: Context) {
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Falta id de sesión' }, 400);

    const body = await c.req.json().catch(() => null);
    const answers: unknown = body?.answers;

    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return c.json({ error: 'Se requieren las respuestas del test' }, 400);
    }

    const updated = await this.service.complete(id, answers as Record<number, 'A' | 'B'>);
    if (!updated) return c.json({ error: 'Sesión no encontrada' }, 404);

    return c.json({ ok: true, personalityCode: updated.personality_code });
  }

  /** Lista de usuarios online. */
  async online(c: Context) {
    const users = await this.service.onlineUsers();
    return c.json(users);
  }

  /** Estadísticas de uso. */
  async stats(c: Context) {
    const stats = await this.service.getStats();
    return c.json(stats);
  }
}
