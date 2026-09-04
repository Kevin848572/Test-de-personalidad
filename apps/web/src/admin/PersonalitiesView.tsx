import { useCallback, useEffect, useState } from 'react';
import { adminApi, ApiError, type PersonalityRow } from '../services/adminApi';
import type { MBTICode } from '@personalidad/core';
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  FieldFeedback,
  AdminAlert,
  Spinner
} from './ui';

const ALL_CODES: MBTICode[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const EMPTY_FORM = {
  code: '' as MBTICode | '',
  titulo: '',
  descripcion: '',
  fortalezas: [] as string[],
  debilidades: [] as string[]
};

export function PersonalitiesView() {
  const [items, setItems] = useState<PersonalityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingCode, setEditingCode] = useState<MBTICode | null>(null);
  const [fortText, setFortText] = useState('');
  const [debText, setDebText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.personalities();
      setItems(res.items);
    } catch (e) {
      setFeedback({ type: 'error', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(p: PersonalityRow) {
    setEditingCode(p.code);
    setForm({
      code: p.code,
      titulo: p.titulo,
      descripcion: p.descripcion,
      fortalezas: p.fortalezas,
      debilidades: p.debilidades
    });
    setFortText(p.fortalezas.join('\n'));
    setDebText(p.debilidades.join('\n'));
    setFieldErrors({});
    setFeedback(null);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingCode(null);
    setForm(EMPTY_FORM);
    setFortText('');
    setDebText('');
    setFieldErrors({});
  }

  function validate(fortalezas: string[], debilidades: string[]): boolean {
    const errs: Record<string, string> = {};

    if (!form.code) {
      errs.code = 'Selecciona un código de personalidad MBTI.';
    } else if (!ALL_CODES.includes(form.code as MBTICode)) {
      errs.code = 'Código MBTI inválido.';
    }

    if (!form.titulo.trim()) {
      errs.titulo = 'El título de la personalidad es obligatorio.';
    } else if (form.titulo.trim().length < 3) {
      errs.titulo = 'El título debe tener al menos 3 caracteres.';
    }

    if (!form.descripcion.trim()) {
      errs.descripcion = 'La descripción es obligatoria.';
    } else if (form.descripcion.trim().length < 10) {
      errs.descripcion = 'La descripción debe tener al menos 10 caracteres explicativos.';
    }

    if (fortalezas.length === 0) {
      errs.fortalezas = 'Ingresa al menos una fortaleza (una por línea).';
    }

    if (debilidades.length === 0) {
      errs.debilidades = 'Ingresa al menos un área de mejora o debilidad (una por línea).';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const fortalezas = fortText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const debilidades = debText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!validate(fortalezas, debilidades)) return;

    setSubmitting(true);
    try {
      await adminApi.upsertPersonality({
        code: (form.code as string).toUpperCase() as MBTICode,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fortalezas,
        debilidades
      });
      setFeedback({
        type: 'success',
        message: `Personalidad ${form.code} guardada exitosamente.`
      });
      resetForm();
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

  async function handleDelete(code: string) {
    if (!confirm(`¿Eliminar los datos personalizados del perfil MBTI ${code}?`)) return;
    setFeedback(null);
    try {
      await adminApi.deletePersonality(code);
      if (editingCode === code) resetForm();
      setFeedback({ type: 'success', message: `Perfil ${code} eliminado de la base de datos.` });
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

      <AdminCard title="Tipos de Personalidad (16 Perfiles MBTI)">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ALL_CODES.map((code) => {
              const p = items.find((i) => i.code === code);
              const isSelected = code === editingCode;
              return (
                <div
                  key={code}
                  className={`rounded-xl border p-4 text-center transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/15 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                      : 'border-white/[0.08] bg-white/[0.03] hover:border-gold/50'
                  }`}
                >
                  <div className="text-xl font-black tracking-wide text-gold">{code}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-neutral-300">
                    {p?.titulo ?? 'Sin personalizar'}
                  </div>
                  <div className="mt-3 flex justify-center gap-2">
                    <AdminButton
                      variant={isSelected ? 'primary' : 'ghost'}
                      onClick={() => {
                        if (p) {
                          startEdit(p);
                        } else {
                          setEditingCode(code);
                          setForm({ ...EMPTY_FORM, code });
                          setFortText('');
                          setDebText('');
                        }
                      }}
                      className="px-2.5 py-1 text-xs"
                    >
                      {p ? 'Editar' : '+ Crear'}
                    </AdminButton>
                    {p && (
                      <AdminButton
                        variant="danger"
                        onClick={() => handleDelete(code)}
                        className="px-2.5 py-1 text-xs"
                      >
                        ✕
                      </AdminButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      {(editingCode || form.code || form.titulo || fortText || debText) && (
        <AdminCard
          title={editingCode ? `Editar Perfil MBTI: ${editingCode}` : 'Configurar Perfil MBTI'}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-400">
                  Código MBTI
                </label>
                <select
                  value={form.code as string}
                  onChange={(e) => {
                    setForm({ ...form, code: e.target.value as MBTICode });
                    if (fieldErrors.code) setFieldErrors((prev) => ({ ...prev, code: '' }));
                  }}
                  disabled={Boolean(editingCode) || submitting}
                  className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="" className="bg-neutral-900">— Seleccionar Código —</option>
                  {ALL_CODES.map((c) => (
                    <option key={c} value={c} className="bg-neutral-900">
                      {c}
                    </option>
                  ))}
                </select>
                <FieldFeedback error={fieldErrors.code} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-neutral-400">
                  Título Descriptivo
                </label>
                <AdminInput
                  value={form.titulo}
                  onChange={(e) => {
                    setForm({ ...form, titulo: e.target.value });
                    if (fieldErrors.titulo) setFieldErrors((prev) => ({ ...prev, titulo: '' }));
                  }}
                  hasError={Boolean(fieldErrors.titulo)}
                  placeholder="Ej: INTJ — El Arquitecto o Estratega"
                  disabled={submitting}
                />
                <FieldFeedback error={fieldErrors.titulo} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-400">
                Descripción General
              </label>
              <AdminTextarea
                value={form.descripcion}
                onChange={(e) => {
                  setForm({ ...form, descripcion: e.target.value });
                  if (fieldErrors.descripcion) setFieldErrors((prev) => ({ ...prev, descripcion: '' }));
                }}
                hasError={Boolean(fieldErrors.descripcion)}
                placeholder="Detalla cómo piensa, interactúa y se desenvuelve este tipo de personalidad..."
                rows={3}
                disabled={submitting}
              />
              <FieldFeedback error={fieldErrors.descripcion} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-400">
                  Fortalezas Clave (1 por línea)
                </label>
                <AdminTextarea
                  value={fortText}
                  onChange={(e) => {
                    setFortText(e.target.value);
                    if (fieldErrors.fortalezas) setFieldErrors((prev) => ({ ...prev, fortalezas: '' }));
                  }}
                  hasError={Boolean(fieldErrors.fortalezas)}
                  placeholder="Pensamiento estratégico analítico&#10;Capacidad de resolver problemas complejos&#10;Orientación a resultados de calidad"
                  rows={4}
                  disabled={submitting}
                />
                <FieldFeedback error={fieldErrors.fortalezas} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-400">
                  Áreas de Mejora / Debilidades (1 por línea)
                </label>
                <AdminTextarea
                  value={debText}
                  onChange={(e) => {
                    setDebText(e.target.value);
                    if (fieldErrors.debilidades) setFieldErrors((prev) => ({ ...prev, debilidades: '' }));
                  }}
                  hasError={Boolean(fieldErrors.debilidades)}
                  placeholder="Dificultad para recibir críticas&#10;Puede resultar excesivamente crítico&#10;Tendencia al perfeccionismo"
                  rows={4}
                  disabled={submitting}
                />
                <FieldFeedback error={fieldErrors.debilidades} />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
              <AdminButton
                type="button"
                variant="secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancelar
              </AdminButton>
              <AdminButton type="submit" disabled={submitting}>
                {submitting
                  ? 'Guardando…'
                  : editingCode
                  ? 'Actualizar Personalidad'
                  : 'Crear Personalidad'}
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      )}
    </div>
  );
}