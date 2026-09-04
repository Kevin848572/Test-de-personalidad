import type { DatabaseAdapter } from '../db/databaseAdapter.js';
import {
  personalities as corePersonalities,
  type MBTICode,
  type PersonalityInfo
} from '@personalidad/core';

export interface StoredPersonality {
  code: MBTICode;
  titulo: string;
  descripcion: string;
  fortalezas: string[];
  debilidades: string[];
  updated_at: string;
}

export interface CreatePersonalityInput {
  code: string;
  titulo: string;
  descripcion: string;
  fortalezas: string[];
  debilidades: string[];
}

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

function normalizePersonality(r: any): StoredPersonality {
  return {
    code: r.code as MBTICode,
    titulo: r.titulo,
    descripcion: r.descripcion,
    fortalezas: parseJsonArray(r.fortalezas),
    debilidades: parseJsonArray(r.debilidades),
    updated_at: r.updated_at
  };
}

/**
 * Modelo de la entidad Personalidad (descripciones MBTI).
 * Editable desde el panel de administración.
 */
export class PersonalityModel {
  constructor(private readonly db: DatabaseAdapter) {}

  async list(): Promise<StoredPersonality[]> {
    const rows = await this.db.query<any>(
      'SELECT code, titulo, descripcion, fortalezas, debilidades, updated_at FROM personalities ORDER BY code ASC'
    );
    return rows.map(normalizePersonality);
  }

  async findByCode(code: string): Promise<StoredPersonality | undefined> {
    const row = await this.db.queryOne<any>(
      'SELECT code, titulo, descripcion, fortalezas, debilidades, updated_at FROM personalities WHERE code = $1',
      [code]
    );
    return row ? normalizePersonality(row) : undefined;
  }

  async upsert(input: CreatePersonalityInput): Promise<StoredPersonality[]> {
    const nowIso = new Date().toISOString();
    const rows = await this.db.query<any>(
      `INSERT INTO personalities (code, titulo, descripcion, fortalezas, debilidades, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (code) DO UPDATE SET
         titulo = EXCLUDED.titulo,
         descripcion = EXCLUDED.descripcion,
         fortalezas = EXCLUDED.fortalezas,
         debilidades = EXCLUDED.debilidades,
         updated_at = EXCLUDED.updated_at
       RETURNING code, titulo, descripcion, fortalezas, debilidades, updated_at`,
      [
        input.code.toUpperCase(),
        input.titulo,
        input.descripcion,
        input.fortalezas,
        input.debilidades,
        nowIso
      ]
    );
    return rows.map(normalizePersonality);
  }

  async remove(code: string): Promise<void> {
    await this.db.query('DELETE FROM personalities WHERE code = $1', [code.toUpperCase()]);
  }

  async count(): Promise<number> {
    const row = await this.db.queryOne<{ count: string | number }>(
      'SELECT count(*) as count FROM personalities'
    );
    return Number(row?.count ?? 0);
  }

  /** Si la tabla está vacía, la llena con las descripciones base del core. */
  async seedIfEmpty(): Promise<void> {
    const count = await this.count();
    if (count > 0) return;

    for (const entry of Object.entries(corePersonalities) as [MBTICode, PersonalityInfo][]) {
      const code = entry[0];
      const info = entry[1];
      await this.upsert({
        code,
        titulo: info.titulo,
        descripcion: info.descripcion,
        fortalezas: info.fortalezas,
        debilidades: info.debilidades
      });
    }
  }
}
