import type { Context } from 'hono';

export class HealthController {
  check(c: Context) {
    return c.json({ status: 'ok', service: 'personalidad-api', time: new Date().toISOString() });
  }
}
