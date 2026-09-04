import { useEffect, useState } from 'react';
import { api, type SessionStats } from '../services/api';
import { adminApi, type PersonalityRow } from '../services/adminApi';
import { AdminCard, Spinner } from './ui';

export function DashboardView() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [personalities, setPersonalities] = useState<PersonalityRow[]>([]);
  const [usersTotal, setUsersTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, u, p] = await Promise.all([
          api.stats(),
          adminApi.users(),
          adminApi.personalities()
        ]);
        setStats(s);
        setUsersTotal(u.total);
        setPersonalities(p.items);
      } catch (e) {
        setError((e as Error).message);
      }
    }
    load();
  }, []);

  if (!stats) return error ? <p className="text-sm text-red-400">{error}</p> : <Spinner />;

  const cards = [
    { label: 'En línea ahora', value: stats.online_count },
    { label: 'Usuarios únicos', value: stats.unique_users },
    { label: 'Test completados', value: stats.completed_count },
    { label: 'Test iniciados', value: stats.started_count },
    { label: 'Total usuarios', value: usersTotal ?? '—' },
    { label: 'Personalidades', value: personalities.length }
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
            <div className="text-3xl font-extrabold text-gold">{c.value}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-neutral-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminCard title="Distribución de personalidades">
          {personalities.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin resultados aún.</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {personalities
                .filter((p) => p.code)
                .slice()
                .sort()
                .map((p) => (
                  <div key={p.code} className="flex items-center justify-between rounded-md border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                    <span className="text-sm font-semibold text-white">{p.code}</span>
                    <span className="text-xs text-neutral-500">{p.titulo}</span>
                  </div>
                ))}
            </div>
          )}
        </AdminCard>

        <AdminCard title="Información rápida">
          <p className="text-sm leading-relaxed text-neutral-400">
            Este panel te permite administrar el Test de Personalidad:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-400">
            <li>• Revisar quién está en línea y las estadísticas de uso.</li>
            <li>• Gestionar usuarios y sesiones/resultados.</li>
            <li>• Editar preguntas y descripciones de personalidades.</li>
            <li>• Crear y administrar accesos de administrador.</li>
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}