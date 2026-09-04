import { sign, verify } from 'hono/jwt';
import { AlgorithmTypes } from 'hono/jwt';
import type { Context, MiddlewareHandler } from 'hono';
import type { Config } from '../config.js';

export interface AdminTokenPayload {
  [key: string]: unknown;
  sub: string;
  username: string;
  role: 'admin';
  exp: number;
}

const ALG = AlgorithmTypes.HS256;

export async function signAdminToken(
  jwtSecret: string,
  admin: { id: string; username: string }
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = {
    sub: admin.id,
    username: admin.username,
    role: 'admin',
    exp: now + 60 * 60 * 12 // 12 horas
  };
  return sign(payload, jwtSecret, ALG);
}

/**
 * Middleware que protege las rutas de administración.
 * Exige un token JWT válido con rol "admin" en la cabecera
 * `Authorization: Bearer <token>`.
 */
export function requireAdmin(config: Config): MiddlewareHandler {
  return async (c: Context, next) => {
    const header = c.req.header('Authorization');
    if (!header?.toLowerCase().startsWith('bearer ')) {
      return c.json({ error: 'No autorizado' }, 401);
    }
    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = (await verify(token, config.jwtSecret, ALG)) as unknown as AdminTokenPayload;
      if (payload.role !== 'admin') {
        return c.json({ error: 'No autorizado' }, 403);
      }
      c.set('admin', { id: payload.sub, username: payload.username });
      await next();
    } catch {
      return c.json({ error: 'Sesión inválida o expirada' }, 401);
    }
  };
}
