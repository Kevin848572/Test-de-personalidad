import type { Context } from 'hono';
import type { QuestionModel } from '../models/QuestionModel.js';
import type { DimensionPair } from '@personalidad/core';

const DIMS: DimensionPair[] = ['E/I', 'S/N', 'T/F', 'J/P'];

/** Mapeo de columna esperada a dimensión en MBTI estándar */
const EXPECTED_DIM_BY_COL: Record<number, DimensionPair> = {
  1: 'E/I',
  2: 'S/N',
  3: 'S/N',
  4: 'T/F',
  5: 'T/F',
  6: 'J/P',
  7: 'J/P'
};

/** Controlador de administración de preguntas (CRUD) con validaciones estructuradas. */
export class AdminQuestionsController {
  constructor(private readonly questions: QuestionModel) {}

  async list(c: Context) {
    const items = await this.questions.list();
    const total = await this.questions.count();
    return c.json({ ok: true, items, total });
  }

  private validate(body: any): {
    ok: boolean;
    data?: { text: string; column: number; dim: DimensionPair; is_active: boolean };
    error?: string;
    fields?: Record<string, string>;
  } {
    const text = body?.text;
    const col = body?.column;
    const dim = body?.dim;
    const fields: Record<string, string> = {};

    if (typeof text !== 'string' || !text.trim()) {
      fields.text = 'El enunciado de la pregunta es obligatorio.';
    } else if (text.trim().length < 5) {
      fields.text = 'El enunciado debe tener al menos 5 caracteres.';
    }

    if (typeof col !== 'number' || !Number.isInteger(col) || col < 1 || col > 7) {
      fields.column = 'La columna debe ser un número entero entre 1 y 7.';
    }

    if (typeof dim !== 'string' || !DIMS.includes(dim as DimensionPair)) {
      fields.dim = 'La dimensión debe ser una de: E/I, S/N, T/F, J/P.';
    } else if (typeof col === 'number' && EXPECTED_DIM_BY_COL[col] && EXPECTED_DIM_BY_COL[col] !== dim) {
      fields.dim = `Para la columna ${col}, la dimensión esperada es ${EXPECTED_DIM_BY_COL[col]}.`;
    }

    if (Object.keys(fields).length > 0) {
      return { ok: false, error: 'Por favor corrige los errores del formulario de la pregunta.', fields };
    }

    return {
      ok: true,
      data: {
        text: text.trim(),
        column: col,
        dim: dim as DimensionPair,
        is_active: body?.is_active !== false
      }
    };
  }

  async create(c: Context) {
    const body = await c.req.json().catch(() => null);
    const v = this.validate(body);
    if (!v.ok || !v.data) {
      return c.json({ ok: false, error: v.error, fields: v.fields }, 400);
    }

    const maxId = (await this.questions.list()).reduce(
      (max, q) => Math.max(max, q.id),
      0
    );
    const item = await this.questions.create({ id: maxId + 1, ...v.data });
    return c.json({ ok: true, ...(item[0] || v.data) }, 201);
  }

  async update(c: Context) {
    const id = Number(c.req.param('id'));
    if (!id || isNaN(id)) {
      return c.json({ ok: false, error: 'Identificador de pregunta no válido.' }, 400);
    }

    const existing = await this.questions.findById(id);
    if (!existing) {
      return c.json({ ok: false, error: `No se encontró la pregunta con ID ${id}.` }, 404);
    }

    const body = await c.req.json().catch(() => null);
    const v = this.validate(body);
    if (!v.ok || !v.data) {
      return c.json({ ok: false, error: v.error, fields: v.fields }, 400);
    }

    const item = await this.questions.update(id, v.data);
    return c.json({ ok: true, ...(item[0] || v.data) });
  }

  async remove(c: Context) {
    const id = Number(c.req.param('id'));
    if (!id || isNaN(id)) {
      return c.json({ ok: false, error: 'Identificador de pregunta no válido.' }, 400);
    }

    const existing = await this.questions.findById(id);
    if (!existing) {
      return c.json({ ok: false, error: `No se encontró la pregunta con ID ${id}.` }, 404);
    }

    await this.questions.remove(id);
    return c.json({ ok: true, message: 'Pregunta eliminada exitosamente.' });
  }
}
