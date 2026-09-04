import type { Context } from 'hono';
import type { PersonalityModel } from '../models/PersonalityModel.js';
import type { MBTICode } from '@personalidad/core';

const VALID_MBTI_CODES: MBTICode[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

/** Controlador de administración de personalidades (CRUD) con validaciones estructuradas. */
export class AdminPersonalitiesController {
  constructor(private readonly personalities: PersonalityModel) {}

  async list(c: Context) {
    const items = await this.personalities.list();
    return c.json({ ok: true, items, total: items.length });
  }

  private validate(body: any): {
    ok: boolean;
    data?: {
      code: MBTICode;
      titulo: string;
      descripcion: string;
      fortalezas: string[];
      debilidades: string[];
    };
    error?: string;
    fields?: Record<string, string>;
  } {
    const code = body?.code;
    const titulo = body?.titulo;
    const descripcion = body?.descripcion;
    const fortalezas = body?.fortalezas;
    const debilidades = body?.debilidades;

    const fields: Record<string, string> = {};

    const cleanCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
    if (!cleanCode) {
      fields.code = 'El código MBTI es requerido.';
    } else if (!VALID_MBTI_CODES.includes(cleanCode as MBTICode)) {
      fields.code = `Código MBTI no reconocido. Debe ser uno de: ${VALID_MBTI_CODES.join(', ')}.`;
    }

    if (typeof titulo !== 'string' || !titulo.trim()) {
      fields.titulo = 'El título de la personalidad es requerido.';
    } else if (titulo.trim().length < 3) {
      fields.titulo = 'El título debe tener al menos 3 caracteres.';
    }

    if (typeof descripcion !== 'string' || !descripcion.trim()) {
      fields.descripcion = 'La descripción es requerida.';
    } else if (descripcion.trim().length < 10) {
      fields.descripcion = 'La descripción debe tener al menos 10 caracteres explicativos.';
    }

    const cleanFortalezas = Array.isArray(fortalezas)
      ? fortalezas.map((f) => (typeof f === 'string' ? f.trim() : '')).filter(Boolean)
      : [];
    if (cleanFortalezas.length === 0) {
      fields.fortalezas = 'Debes ingresar al menos una fortaleza válida.';
    }

    const cleanDebilidades = Array.isArray(debilidades)
      ? debilidades.map((d) => (typeof d === 'string' ? d.trim() : '')).filter(Boolean)
      : [];
    if (cleanDebilidades.length === 0) {
      fields.debilidades = 'Debes ingresar al menos una debilidad o área de mejora válida.';
    }

    if (Object.keys(fields).length > 0) {
      return { ok: false, error: 'Por favor corrige los errores en los datos del tipo de personalidad.', fields };
    }

    return {
      ok: true,
      data: {
        code: cleanCode as MBTICode,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fortalezas: cleanFortalezas,
        debilidades: cleanDebilidades
      }
    };
  }

  async upsert(c: Context) {
    const body = await c.req.json().catch(() => null);
    const v = this.validate(body);
    if (!v.ok || !v.data) {
      return c.json({ ok: false, error: v.error, fields: v.fields }, 400);
    }

    const items = await this.personalities.upsert(v.data);
    return c.json({ ok: true, ...(items[0] || v.data) }, 200);
  }

  async remove(c: Context) {
    const code = c.req.param('code');
    if (!code) {
      return c.json({ ok: false, error: 'Falta código de personalidad' }, 400);
    }

    const cleanCode = code.toUpperCase();
    const existing = await this.personalities.findByCode(cleanCode);
    if (!existing) {
      return c.json({ ok: false, error: `No se encontró la personalidad "${cleanCode}".` }, 404);
    }

    await this.personalities.remove(cleanCode);
    return c.json({ ok: true, message: `Personalidad ${cleanCode} eliminada exitosamente.` });
  }
}
