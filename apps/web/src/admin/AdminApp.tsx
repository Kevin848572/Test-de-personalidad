import { useEffect, useState } from 'react';
import { adminApi, clearSession, getStoredUsername, isLoggedIn } from '../services/adminApi';
import { AdminLogin } from './AdminLogin';
import { DashboardView } from './DashboardView';
import { UsersView } from './UsersView';
import { SessionsView } from './SessionsView';
import { QuestionsView } from './QuestionsView';
import { PersonalitiesView } from './PersonalitiesView';
import { AdminsView } from './AdminsView';

type Tab = 'dashboard' | 'users' | 'sessions' | 'questions' | 'personalities' | 'admins';

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Usuarios', icon: '👥' },
  { id: 'sessions', label: 'Sesiones', icon: '🧪' },
  { id: 'questions', label: 'Preguntas', icon: '❓' },
  { id: 'personalities', label: 'Personalidades', icon: '🧠' },
  { id: 'admins', label: 'Administradores', icon: '🔑' }
];

export function AdminApp({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [username, setUsername] = useState<string | null>(getStoredUsername());

  useEffect(() => {
    if (!isLoggedIn()) return;
    // Valida que el token siga vigente en el servidor.
    adminApi.me().catch(() => setAuthed(false));
  }, []);

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={() => {
          setAuthed(true);
          setUsername(getStoredUsername());
          setTab('dashboard');
        }}
      />
    );
  }

  function handleLogout() {
    clearSession();
    setAuthed(false);
    setUsername(null);
    onExit();
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-cover bg-fixed bg-center lg:flex-row" style={{ backgroundImage: "url('/img/fondo.png')" }}>
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/70" />

      <aside className="relative z-10 w-full border-b border-white/[0.06] bg-[rgba(10,10,10,0.9)] p-4 backdrop-blur-xl lg:w-60 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <div>
            <div className="text-lg font-extrabold tracking-wide text-gold">Panel Admin</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500">
              {username ?? 'Administrador'}
            </div>
          </div>
          <AdminExit onExit={handleLogout} />
        </div>

        <nav className="flex flex-wrap gap-1.5 lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                tab === t.id
                  ? 'bg-gold text-neutral-900'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8">
        {tab === 'dashboard' && <DashboardView />}
        {tab === 'users' && <UsersView />}
        {tab === 'sessions' && <SessionsView />}
        {tab === 'questions' && <QuestionsView />}
        {tab === 'personalities' && <PersonalitiesView />}
        {tab === 'admins' && <AdminsView />}
      </main>
    </div>
  );
}

function AdminExit({ onExit }: { onExit: () => void }) {
  return (
    <button
      onClick={onExit}
      className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-neutral-400 transition-colors hover:border-gold hover:text-gold"
      title="Salir del panel"
    >
      Salir
    </button>
  );
}