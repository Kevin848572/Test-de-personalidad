import { useCallback, useEffect, useState } from 'react';
import { adminApi, ApiError, type QuestionRow } from '../services/adminApi';
import type { DimensionPair } from '@personalidad/core';
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPill,
  AdminTable,
  AdminTextarea,
  FieldFeedback,
  AdminAlert,
  Spinner
} from './ui';

const DIMS: DimensionPair[] = ['E/I', 'S/N', 'T/F', 'J/P'];

const EXPECTED_DIM_BY_COL: Record<number, DimensionPair> = {
  1: 'E/I',
  2: 'S/N',
  3: 'S/N',
  4: 'T/F',
  5: 'T/F',
  6: 'J/P',
  7: 'J/P'
};

const EMPTY_FORM = { text: '', column: 1, dim: 'E/I' as DimensionPair, is_active: true };

export function QuestionsView() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.questions();
      setQuestions(res.items);
    } catch (e) {
      setFeedback({ type: 'error', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(q: QuestionRow) {
    setEditingId(q.id);
    setForm({ text: q.text, column: q.column, dim: q.dim, is_active: q.is_active });
    setFieldErrors({});
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
  }

  function handleColumnChange(colVal: number) {
    const recommendedDim = EXPECTED_DIM_BY_COL[colVal];
    setForm((prev) => ({
      ...prev,
      column: colVal,
      dim: recommendedDim || prev.dim
    }));
    if (fieldErrors.column) {
      setFieldErrors((prev) => ({ ...prev, column: '', dim: '' }));
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.text.trim()) {
      errs.text = 'El enunciado de la pregunta es obligatorio.';
    } else if (form.text.trim().length < 5) {
      errs.text = 'El enunciado debe tener al menos 5 caracteres.';
    }

    if (form.column < 1 || form.column > 7 || !Number.isInteger(form.column)) {
      errs.column = 'La columna debe estar entre 1 y 7.';
    }

    if (!DIMS.includes(form.dim)) {
      errs.dim = 'Selecciona una dimensión válida.';
    } else if (EXPECTED_DIM_BY_COL[form.column] && EXPECTED_DIM_BY_COL[form.column] !== form.dim) {
      errs.dim = `Para la columna ${form.column}, la dimensión esperada es ${EXPECTED_DIM_BY_COL[form.column]}.`;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingId !== null) {
        await adminApi.updateQuestion(editingId, form);
        setFeedback({ type: 'success', message: `Pregunta #${editingId} actualizada con éxito.` });
      } else {
        await adminApi.createQuestion(form);
        setFeedback({ type: 'success', message: 'Nueva pregunta creada con éxito.' });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFieldErrors({});
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setFieldErrors(err.fields);
      }
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(`¿Eliminar la pregunta #${id}?`)) return;
    setFeedback(null);
    try {
      await adminApi.deleteQuestion(id);
      if (editingId === id) {
        handleCancelEdit();
      }
      setFeedback({ type: 'success', message: `Pregunta #${id} eliminada.` });
      await load();
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <AdminCard
        title={editingId !== null ? `Editar Pregunta #${editingId}` : 'Nueva Pregunta'}
        action={
          editingId !== null && (
            <span className="text-xs text-gold">Modo Edición Activo</span>
          )
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-400">
              Texto o Enunciado del Item
            </label>
            <AdminTextarea
              value={form.text}
              onChange={(e) => {
                setForm({ ...form, text: e.target.value });
                if (fieldErrors.text) setFieldErrors((prev) => ({ ...prev, text: '' }));
              }}
              hasError={Boolean(fieldErrors.text)}
              placeholder="Ej: Disfruto participar activamente en conversaciones grupales amplias."
              rows={3}
              disabled={submitting}
            />
            <FieldFeedback error={fieldErrors.text} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-400">
                Columna (1 a 7)
              </label>
              <AdminInput
                type="number"
                min={1}
                max={7}
                value={form.column}
                onChange={(e) => handleColumnChange(Number(e.target.value))}
                hasError={Boolean(fieldErrors.column)}
                placeholder="1-7"
                disabled={submitting}
              />
              <FieldFeedback error={fieldErrors.column} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-400">
                Dimensión MBTI
              </label>
              <select
                value={form.dim}
                onChange={(e) => {
                  setForm({ ...form, dim: e.target.value as DimensionPair });
                  if (fieldErrors.dim) setFieldErrors((prev) => ({ ...prev, dim: '' }));
                }}
                disabled={submitting}
                className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold transition-colors"
              >
                {DIMS.map((d) => (
                  <option key={d} value={d} className="bg-neutral-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
              <FieldFeedback error={fieldErrors.dim} />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold"
                />
                <span>Pregunta Activa en el Test</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end border-t border-white/10 pt-3">
            {editingId !== null && (
              <AdminButton
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancelar Edición
              </AdminButton>
            )}
            <AdminButton type="submit" disabled={submitting}>
              {submitting
                ? 'Guardando…'
                : editingId !== null
                ? 'Actualizar Pregunta'
                : 'Guardar Nueva Pregunta'}
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      <AdminCard title={`Banco de Preguntas (${questions.length})`}>
        {loading ? (
          <Spinner />
        ) : (
          <AdminTable head={['ID', 'Texto del Item', 'Dimensión', 'Columna', 'Estado', 'Acciones']}>
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-3 py-3 text-neutral-500 font-mono text-xs">#{q.id}</td>
                <td className="px-3 py-3 text-neutral-200 text-sm max-w-md">{q.text}</td>
                <td className="px-3 py-3 font-semibold text-gold text-xs">{q.dim}</td>
                <td className="px-3 py-3 text-neutral-400 text-xs">Col {q.column}</td>
                <td className="px-3 py-3">
                  <AdminPill tone={q.is_active ? 'ok' : 'neutral'}>
                    {q.is_active ? 'Activa' : 'Inactiva'}
                  </AdminPill>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <AdminButton variant="ghost" onClick={() => startEdit(q)}>
                      ✏️ Editar
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => handleDelete(q.id)}>
                      🗑️ Eliminar
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}