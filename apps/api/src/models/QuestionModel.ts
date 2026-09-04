import type { DatabaseAdapter } from '../db/databaseAdapter.js';
import { questions as coreQuestions, type DimensionPair } from '@personalidad/core';

export interface StoredQuestion {
  id: number;
  text: string;
  column: number;
  dim: DimensionPair;
  is_active: boolean;
}

export interface CreateQuestionInput {
  id?: number;
  text: string;
  column: number;
  dim: DimensionPair;
  is_active?: boolean;
}

function normalizeQuestion(r: any): StoredQuestion {
  return {
    id: Number(r.id),
    text: r.text,
    column: Number(r.column),
    dim: r.dim as DimensionPair,
    is_active: Boolean(r.is_active)
  };
}

/**
 * Modelo de la entidad Pregunta.
 * Leer/escribir las preguntas desde la BD vía DatabaseAdapter.
 */
export class QuestionModel {
  constructor(private readonly db: DatabaseAdapter) {}

  async list(activeOnly = false, order = 'id.asc'): Promise<StoredQuestion[]> {
    const orderClause = order === 'id.desc' ? 'ORDER BY id DESC' : 'ORDER BY id ASC';
    let sql = `SELECT id, text, "column", dim, is_active FROM questions ${orderClause}`;
    const params: any[] = [];

    if (activeOnly) {
      sql = `SELECT id, text, "column", dim, is_active FROM questions WHERE is_active = $1 ${orderClause}`;
      params.push(true);
    }

    const rows = await this.db.query<any>(sql, params);
    return rows.map(normalizeQuestion);
  }

  async findById(id: number): Promise<StoredQuestion | undefined> {
    const row = await this.db.queryOne<any>(
      'SELECT id, text, "column", dim, is_active FROM questions WHERE id = $1',
      [id]
    );
    return row ? normalizeQuestion(row) : undefined;
  }

  async create(input: CreateQuestionInput): Promise<StoredQuestion[]> {
    let id = input.id;
    if (id === undefined) {
      const maxRow = await this.db.queryOne<{ next_id: number | string }>(
        'SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM questions'
      );
      id = Number(maxRow?.next_id ?? 1);
    }

    const rows = await this.db.query<any>(
      `INSERT INTO questions (id, text, "column", dim, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, text, "column", dim, is_active`,
      [id, input.text, input.column, input.dim, input.is_active ?? true]
    );
    return rows.map(normalizeQuestion);
  }

  async update(id: number, patch: Partial<CreateQuestionInput>): Promise<StoredQuestion[]> {
    const sets: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (patch.text !== undefined) {
      sets.push(`text = $${idx++}`);
      params.push(patch.text);
    }
    if (patch.column !== undefined) {
      sets.push(`"column" = $${idx++}`);
      params.push(patch.column);
    }
    if (patch.dim !== undefined) {
      sets.push(`dim = $${idx++}`);
      params.push(patch.dim);
    }
    if (patch.is_active !== undefined) {
      sets.push(`is_active = $${idx++}`);
      params.push(patch.is_active);
    }

    sets.push(`updated_at = $${idx++}`);
    params.push(new Date().toISOString());

    params.push(id);
    const sql = `UPDATE questions SET ${sets.join(', ')} WHERE id = $${idx}
      RETURNING id, text, "column", dim, is_active`;

    const rows = await this.db.query<any>(sql, params);
    return rows.map(normalizeQuestion);
  }

  async remove(id: number): Promise<void> {
    await this.db.query('DELETE FROM questions WHERE id = $1', [id]);
  }

  async count(): Promise<number> {
    const row = await this.db.queryOne<{ count: string | number }>(
      'SELECT count(*) as count FROM questions'
    );
    return Number(row?.count ?? 0);
  }

  /** Si la tabla está vacía, la llena con las preguntas base del core. */
  async seedIfEmpty(): Promise<void> {
    const count = await this.count();
    if (count > 0) return;

    for (const q of coreQuestions) {
      await this.create({
        id: q.id,
        text: q.text,
        column: q.column,
        dim: q.dim,
        is_active: true
      });
    }
  }
}
