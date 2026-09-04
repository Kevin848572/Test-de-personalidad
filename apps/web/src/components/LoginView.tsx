import { useState, type FormEvent } from 'react';
import { GlassCard } from './GlassCard';

interface LoginViewProps {
  onStart: (name: string, email?: string) => void;
  loading?: boolean;
}

export function LoginView({ onStart, loading = false }: LoginViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (trimmed.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    setError(null);
    onStart(trimmed, email.trim() || undefined);
  }

  return (
    <section className="flex w-full items-center justify-center p-5 animate-fade-in">
      <GlassCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 text-center sm:p-10">
          <div className="mb-1 flex items-center justify-center gap-6 sm:gap-10">
            <img
              src="/img/logocerveria.png"
              alt="Cervecería Hondureña"
              className="h-24 w-24 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] sm:h-40 sm:w-40"
            />
            <img
              src="/img/logo_UNAH.png"
              alt="UNAH"
              className="h-24 w-24 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] sm:h-40 sm:w-40"
            />
          </div>

          <h1 className="text-lg font-bold tracking-wide text-white sm:text-[19px]">
            Test de Personalidad Institucional
          </h1>
          <p className="text-[11px] uppercase tracking-[1.5px] text-neutral-500">
            Evaluación de Perfil — MBTI
          </p>

          <div className="mt-2 flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Nombre completo"
              autoComplete="off"
              className="w-full border-b border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:font-light placeholder:text-neutral-600 focus:border-gold focus:bg-gold/5"
            />
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Correo electrónico (opcional)"
              autoComplete="email"
              className="w-full border-b border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:font-light placeholder:text-neutral-600 focus:border-gold focus:bg-gold/5"
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-lg bg-gold px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-neutral-900 transition-all hover:bg-gold-hover hover:shadow-[0_4px_24px_rgba(212,175,55,0.3)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Iniciando…' : 'Iniciar Test'}
          </button>
        </form>
      </GlassCard>
    </section>
  );
}
