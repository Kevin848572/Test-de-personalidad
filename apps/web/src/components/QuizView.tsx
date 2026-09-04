import type { Question } from '@personalidad/core';
import { GlassCard } from './GlassCard';

interface QuizViewProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, 'A' | 'B'>;
  onSelect: (value: 'A' | 'B') => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const LETTERS = ['A', 'B'] as const;

export function QuizView({
  questions,
  currentIndex,
  answers,
  onSelect,
  onPrev,
  onNext,
  onSubmit,
  submitting = false
}: QuizViewProps) {
  const q = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const pct = Math.round((answeredCount / questions.length) * 100);

  if (!q) return null;

  const [dimA, dimB] = q.dim.split('/');

  return (
    <section className="flex w-full items-center justify-center p-5">
      <GlassCard className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="h-[2px] w-full overflow-hidden rounded bg-white/10">
          <div
            className="h-full rounded bg-gold transition-all duration-500"
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
        <div className="mb-6 flex justify-between text-[11px] font-medium text-neutral-600">
          <span>{currentIndex + 1} / {questions.length}</span>
          <span>{pct}%</span>
        </div>

        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[1.2px] text-neutral-600">
              Pregunta {q.id} / {questions.length}
            </span>
            <span className="rounded bg-gold/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.8px] text-gold">
              {q.dim}
            </span>
          </div>
          <h2 className="text-[15px] font-medium leading-relaxed tracking-tight text-white sm:text-lg">
            {q.text}
          </h2>
        </div>

        <div className="mb-5 flex flex-col gap-2">
          {LETTERS.map((value) => (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={`flex items-center gap-3.5 rounded-lg border px-4 py-3 text-left text-[13px] transition-all ${
                answers[q.id] === value
                  ? 'border-gold bg-gold/15 text-white'
                  : 'border-white/10 text-neutral-400 hover:border-gold hover:bg-gold/10 hover:text-white'
              }`}
            >
              <span
                className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-all ${
                  answers[q.id] === value
                    ? 'border-gold bg-gold text-neutral-900'
                    : 'border-white/10 text-neutral-600'
                }`}
              >
                {value}
              </span>
              <span className="font-normal">Opción {value === 'A' ? dimA : dimB}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 transition-all hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-25"
          >
            ← Anterior
          </button>

          {!isLast ? (
            <button
              onClick={onNext}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-900 transition-all hover:bg-gold-hover hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="ml-auto rounded-lg bg-gold px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-neutral-900 transition-all hover:bg-gold-hover hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-60"
            >
              {submitting ? 'Enviando…' : 'Ver Resultados'}
            </button>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
