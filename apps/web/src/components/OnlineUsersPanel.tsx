import { useEffect, useState } from 'react';
import { api, type ActiveUser, type SessionStats } from '../services/api';

const ONLINE_REFRESH_MS = 15000;

export function OnlineUsersPanel() {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        const [u, s] = await Promise.all([api.onlineUsers(), api.stats()]);
        setUsers(u);
        setStats(s);
      } catch {
        // El panel se queda vacío si la API no responde, sin mensajes al usuario.
      }
    }
    refresh();
    const id = setInterval(refresh, ONLINE_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-auto fixed left-4 top-4 z-20 hidden w-64 rounded-xl border border-white/[0.06] bg-[rgba(15,15,15,0.9)] p-4 backdrop-blur-xl lg:block">
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gold">
        <span className={`h-2 w-2 rounded-full ${users.length ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
        En línea ahora
      </h3>

      <ul className="mb-3 flex flex-col gap-2">
        {users.length === 0 && (
          <li className="text-[11px] text-neutral-600">Nadie en línea ahora mismo.</li>
        )}
        {users.map((u) => (
          <li
            key={u.session_id}
            className="rounded-md border border-white/[0.05] bg-white/[0.03] px-2.5 py-2"
          >
            <div className="text-[12px] font-semibold text-white">{u.name}</div>
            <div className="text-[10px] text-neutral-500">
              {u.personality_code ? `MBTI ${u.personality_code}` : u.status}
            </div>
          </li>
        ))}
      </ul>

      {stats && (
        <div className="grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3 text-center">
          <div>
            <div className="text-lg font-bold text-white">{stats.online_count}</div>
            <div className="text-[9px] uppercase tracking-wide text-neutral-600">Online</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.unique_users}</div>
            <div className="text-[9px] uppercase tracking-wide text-neutral-600">Usuarios</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.completed_count}</div>
            <div className="text-[9px] uppercase tracking-wide text-neutral-600">Completados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.started_count}</div>
            <div className="text-[9px] uppercase tracking-wide text-neutral-600">Iniciados</div>
          </div>
        </div>
      )}
    </div>
  );
}
