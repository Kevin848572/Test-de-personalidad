import type { Context } from 'hono';
import { questions as coreQuestions } from '@personalidad/core';
import type { QuestionModel } from '../models/QuestionModel.js';

/**
 * Controlador de Preguntas (público).
 * Expone el catálogo a la vista; lee de la BD para reflejar ediciones
 * del administrador, con fallback a las preguntas base del core.
 */
export class QuestionsController {
  constructor(private readonly questions: QuestionModel) {}

  async list(c: Context) {
    try {
      const rows = await this.questions.list(true);
      if (rows.length === 0) {
        return c.json({ questions: coreQuestions });
      }
      return c.json({
        questions: rows.map((q) => ({
          id: q.id,
          text: q.text,
          column: q.column,
          dim: q.dim
        }))
      });
    } catch {
      return c.json({ questions: coreQuestions });
    }
  }
}