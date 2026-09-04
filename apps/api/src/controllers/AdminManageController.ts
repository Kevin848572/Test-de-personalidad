import type { Context } from 'hono';
import type { AdminService } from '../services/AdminService.js';

/** Controlador de gestión de administradores (usuarios admin) con validaciones robustas. */
export class AdminManageController {
  constructor(private readonly service: AdminService) {}

  async list(c: Context) {
    const admins = await this.service.list();
    return c.json({ ok: true, items: admins, total: admins.length });
  }

  async create(c: Context) {
    const body = await c.req.json().catch(() => null);
    const username: unknown = body?.username?.trim();
    const password: unknown = body?.password;

    const fields: Record<string, string> = {};

    if (typeof username !== 'string' || !username) {
      fields.username = 'El nombre de usuario es requerido.';
    } else if (!/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      fields.username = 'El usuario debe tener entre 3 y 30 caracteres (letras, números, guion o guion bajo).';
    }

    if (typeof password !== 'string' || !password) {
      fields.password = 'La contraseña es requerida.';
    } else if (password.length < 4) {
      fields.password = 'La contraseña debe tener al menos 4 caracteres.';
    }

    if (Object.keys(fields).length > 0) {
      return c.json({ ok: false, error: 'Datos de administrador inválidos.', fields }, 400);
    }

    const created = await this.service.createAdmin(username as string, password as string);
    if (!created) {
      return c.json({
        ok: false,
        error: `El nombre de usuario "${username}" ya está registrado. Elige otro.`,
        fields: { username: 'Este nombre de usuario ya está en uso.' }
      }, 409);
    }

    return c.json({ ok: true, ...created }, 201);
  }

  async changePassword(c: Context) {
    const body = await c.req.json().catch(() => null);
    const username: unknown = c.req.param('username');
    const password: unknown = body?.password;

    const fields: Record<string, string> = {};

    if (typeof username !== 'string' || !username) {
      fields.username = 'El nombre de usuario es requerido.';
    }
    if (typeof password !== 'string' || !password) {
      fields.password = 'La nueva contraseña es requerida.';
    } else if (password.length < 4) {
      fields.password = 'La nueva contraseña debe tener al menos 4 caracteres.';
    }

    if (Object.keys(fields).length > 0) {
      return c.json({ ok: false, error: 'Datos de contraseña inválidos.', fields }, 400);
    }

    const ok = await this.service.updatePassword(username as string, password as string);
    if (!ok) {
      return c.json({ ok: false, error: 'Administrador no encontrado.' }, 404);
    }
    return c.json({ ok: true, message: 'Contraseña actualizada correctamente.' });
  }

  async remove(c: Context) {
    const id = c.req.param('id');
    const current = (c.get('admin') as { id: string }).id;
    if (!id) {
      return c.json({ ok: false, error: 'Identificador de administrador faltante.' }, 400);
    }

    if (id === current) {
      return c.json({ ok: false, error: 'No puedes eliminar tu propia cuenta de administrador activa.' }, 400);
    }

    const ok = await this.service.deleteAdmin(id, current);
    if (!ok) {
      return c.json({ ok: false, error: 'No se pudo eliminar el administrador (posiblemente no existe).' }, 400);
    }
    return c.json({ ok: true, message: 'Administrador eliminado exitosamente.' });
  }
}
