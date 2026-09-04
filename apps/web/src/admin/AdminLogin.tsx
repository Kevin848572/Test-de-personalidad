import { useState, type FormEvent } from 'react';
import { adminApi, ApiError } from '../services/adminApi';
import { GlassCard } from '../components/GlassCard';
import { AdminButton, AdminInput, FieldFeedback, AdminAlert } from './ui';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!username.trim()) {
      errs.username = 'Ingresa el nombre de usuario de administrador.';
    }
    if (!password) {
      errs.password = 'Ingresa la contraseña.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await adminApi.login(username.trim(), password);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) {
          setFieldErrors(err.fields);
        }
        setGeneralError(err.message);
      } else {
        setGeneralError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex w-full items-center justify-center p-5 animate-fade-in">
      <GlassCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 sm:p-10 w-full max-w-sm">
          <div className="mb-1 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-2xl text-gold shadow-[0_0_25px_rgba(212,175,55,0.2)]">
              🔐
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Panel de Administración</h1>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-neutral-400">
              Control y Gestión del Sistema MBTI
            </p>
          </div>

          {generalError && (
            <AdminAlert
              type="error"
              message={generalError}
              onClose={() => setGeneralError(null)}
            />
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Usuario
            </label>
            <AdminInput
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) {
                  setFieldErrors((prev) => ({ ...prev, username: '' }));
                }
              }}
              hasError={Boolean(fieldErrors.username)}
              placeholder="Ej: admin"
              autoComplete="username"
              disabled={loading}
            />
            <FieldFeedback error={fieldErrors.username} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Contraseña
            </label>
            <div className="relative">
              <AdminInput
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                hasError={Boolean(fieldErrors.password)}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-gold transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
            <FieldFeedback error={fieldErrors.password} />
          </div>

          <AdminButton type="submit" disabled={loading} className="mt-2 py-3 text-sm">
            {loading ? 'Iniciando sesión…' : 'Acceder al Panel'}
          </AdminButton>
        </form>
      </GlassCard>
    </section>
  );
}