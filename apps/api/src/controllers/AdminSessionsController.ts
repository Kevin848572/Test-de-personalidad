import type { Context } from 'hono';
import type { SessionModel } from '../models/SessionModel.js';

/** Controlador de administración de sesiones/resultados. */
export class AdminSessionsController {
  constructor(private readonly sessions: SessionModel) {}

  async list(c: Context) {
    const personality = c.req.query('personality');
    const status = c.req.query('status');
    const limit = Number(c.req.query('limit') ?? 100);
    const offset = Number(c.req.query('offset') ?? 0);

    const items = await this.sessions.listWithUsers({ personality, status, limit, offset });
    return c.json({ items, count: items.length });
  }

  async remove(c: Context) {
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Falta id de sesión' }, 400);
    await this.sessions.remove(id);
    return c.json({ ok: true });
  }

  async byPersonality(c: Context) {
    const rows = await this.sessions.countByPersonality();
    return c.json(rows);
  }
}
