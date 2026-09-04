import type { Context } from 'hono';
import type { UserModel } from '../models/UserModel.js';

/** Controlador de administración de usuarios. */
export class AdminUsersController {
  constructor(private readonly users: UserModel) {}

  async list(c: Context) {
    const search = c.req.query('search');
    const limit = Number(c.req.query('limit') ?? 50);
    const offset = Number(c.req.query('offset') ?? 0);

    const users = await this.users.list({ search, limit, offset });
    const total = await this.users.count();
    return c.json({ items: users, total });
  }

  async remove(c: Context) {
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Falta id de usuario' }, 400);
    await this.users.remove(id);
    return c.json({ ok: true });
  }
}
