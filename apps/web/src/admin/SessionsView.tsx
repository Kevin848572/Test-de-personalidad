import { useCallback, useEffect, useState } from 'react';
import { adminApi, type SessionRow } from '../services/adminApi';
import { AdminButton, AdminCard, AdminPill, AdminTable, Spinner } from './ui';

export function SessionsView() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.sessions(status || undefined);
      setSessions(res.items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta sesión?')) return;
    await adminApi.deleteSession(id);
    await load();
  }

  return (
    <AdminCard title="Sesiones / Resultados">
      <div className="mb-4 flex gap-2">
        {[
          { v: '', l: 'Todas' },
          { v: 'completed', l: 'Completadas' },
          { v: 'started', l: 'En curso' }
        ].map((o) => (
          <AdminButton key={o.v} variant={status === o.v ? 'primary' : 'ghost'} onClick={() => setStatus(o.v)}>
            {o.l}
          </AdminButton>
        ))}
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {loading ? (
        <Spinner />
      ) : sessions.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay sesiones.</p>
      ) : (
        <AdminTable head={['Usuario', 'Email', 'Estado', 'MBTI', 'Inicio', '']}>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td className="px-3 py-2.5 font-medium text-white">{s.user?.name ?? '—'}</td>
              <td className="px-3 py-2.5 text-neutral-400">{s.user?.email ?? '—'}</td>
              <td className="px-3 py-2.5">
                <AdminPill tone={s.status === 'completed' ? 'ok' : 'warn'}>
                  {s.status === 'completed' ? 'Completado' : 'En curso'}
                </AdminPill>
              </td>
              <td className="px-3 py-2.5 font-semibold text-gold">{s.personality_code ?? '—'}</td>
              <td className="px-3 py-2.5 text-neutral-500">{new Date(s.started_at).toLocaleString()}</td>
              <td className="px-3 py-2.5 text-right">
                <AdminButton variant="danger" onClick={() => handleDelete(s.id)}>
                  Eliminar
                </AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </AdminCard>
  );
}