import type { Context } from 'hono';
import type { AdminService } from '../services/AdminService.js';

/** Controlador de autenticación del administrador con validaciones detalladas. */
export class AdminAuthController {
  constructor(private readonly service: AdminService) {}

  async login(c: Context) {
    const body = await c.req.json().catch(() => null);
    const username: unknown = body?.username?.trim();
    const password: unknown = body?.password;

    const fields: Record<string, string> = {};
    if (typeof username !== 'string' || !username) {
      fields.username = 'El nombre de usuario es requerido.';
    }
    if (typeof password !== 'string' || !password) {
      fields.password = 'La contraseña es requerida.';
    }

    if (Object.keys(fields).length > 0) {
      return c.json({ ok: false, error: 'Por favor completa todos los campos requeridos.', fields }, 400);
    }

    const result = await this.service.login(username as string, password as string);
    if (!result) {
      return c.json({
        ok: false,
        error: 'Credenciales inválidas. Verifica tu usuario y contraseña.'
      }, 401);
    }

    return c.json({
      ok: true,
      token: result.token,
      admin: result.admin
    });
  }

  async me(c: Context) {
    const admin = c.get('admin');
    return c.json({ ok: true, admin });
  }
}
