import type { Context } from 'hono';
import type { PersonalityModel } from '../models/PersonalityModel.js';

/** Controlador público (solo lectura) de personalidades. */
export class PersonalitiesController {
  constructor(private readonly personalities: PersonalityModel) {}

  async list(c: Context) {
    const items = await this.personalities.list();
    return c.json({ items, total: items.length });
  }
}
