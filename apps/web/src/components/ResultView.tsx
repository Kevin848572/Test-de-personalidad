import { useMemo } from 'react';
import { computeResult, getDimensionPairs } from '@personalidad/core';
import { GlassCard } from './GlassCard';

interface ResultViewProps {
  answers: Record<number, 'A' | 'B'>;
  name: string;
  email?: string;
  onClose: () => void;
  onRestart: () => void;
}

export function ResultView({ answers, name, email, onClose, onRestart }: ResultViewProps) {
  const result = useMemo(() => computeResult(answers), [answers]);
  const dimensions = useMemo(() => getDimensionPairs(result.scores), [result]);
  const { info, code } = result;

  return (
    <section className="flex w-full items-center justify-center p-5">
      <GlassCard className="overflow-hidden">
        <div className="relative border-b border-white/[0.06] px-5 py-6 text-center sm:px-8 sm:py-7">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className="mb-1.5 text-3xl text-gold">✦</div>
          <h2 className="text-xl font-bold text-gold">Felicitaciones</h2>
          <p className="text-[13px] font-medium text-white">{name}</p>
          {email && <p className="text-[11px] text-neutral-500">{email}</p>}
          <p className="mt-0.5 text-[11px] text-neutral-600">
            Has completado el Test de Personalidad
          </p>
        </div>

        <div className="px-5 py-6 sm:px-8">
          <div className="mb-6 text-center">
            <div className="text-[52px] font-extrabold leading-tight tracking-[10px] text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              {code}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[2.5px] text-neutral-600">
              Tipo de Personalidad
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {dimensions.map(({ pair, lS, rS, pct, winner }) => (
              <div key={pair.label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {pair.l} <span className="font-normal text-neutral-600">vs</span> {pair.r}
                    {winner === pair.l && (
                      <span className="ml-1.5 rounded bg-gold px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-neutral-900">
                        {pair.l}
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500">
                    {lS} – {rS}
                  </span>
                </div>
                <div className="mb-1 h-1 w-full overflow-hidden rounded bg-white/[0.06]">
                  <div
                    className="h-full rounded bg-gold transition-all duration-1000"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-medium text-neutral-600">
                  <span>{pair.l} ({lS})</span>
                  <span>{pair.r} ({rS})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <h3 className="mb-1.5 border-b border-white/[0.06] pb-1.5 text-[15px] font-bold text-white">
              {info?.titulo}
            </h3>
            <p className="mb-3 text-xs leading-relaxed text-neutral-500">{info?.descripcion}</p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3.5">
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-gold">
                  Fortalezas
                </h4>
                <ul className="list-none">
                  {info?.fortalezas.map((f) => (
                    <li
                      key={f}
                      className="relative border-b border-white/[0.04] py-1.5 pl-3 text-[11px] leading-snug text-neutral-500 last:border-b-0"
                    >
                      <span className="absolute left-0 top-3 h-1 w-1 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3.5">
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-neutral-600">
                  Áreas de Mejora
                </h4>
                <ul className="list-none">
                  {info?.debilidades.map((d) => (
                    <li
                      key={d}
                      className="relative border-b border-white/[0.04] py-1.5 pl-3 text-[11px] leading-snug text-neutral-500 last:border-b-0"
                    >
                      <span className="absolute left-0 top-3 h-1 w-1 rounded-full bg-gold" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              onClick={onRestart}
              className="w-full flex-1 rounded-lg border border-white/10 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 transition-all hover:border-gold hover:text-gold sm:w-auto"
            >
              Nuevo Test
            </button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
