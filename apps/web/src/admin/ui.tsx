import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function AdminButton({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'secondary' }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-gold text-neutral-900 hover:bg-gold-hover hover:shadow-[0_2px_12px_rgba(212,175,55,0.25)]',
    secondary: 'bg-white/10 text-white hover:bg-white/15',
    ghost: 'border border-white/10 text-neutral-400 hover:border-gold hover:text-gold',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function AdminInput({
  className = '',
  hasError = false,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const errorStyles = hasError
    ? 'border-red-500/50 bg-red-500/[0.04] focus:border-red-400'
    : 'border-white/10 bg-white/[0.04] focus:border-gold';

  return (
    <input
      className={`w-full rounded-md border px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 ${errorStyles} ${className}`}
      {...rest}
    />
  );
}

export function AdminTextarea({
  className = '',
  hasError = false,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  const errorStyles = hasError
    ? 'border-red-500/50 bg-red-500/[0.04] focus:border-red-400'
    : 'border-white/10 bg-white/[0.04] focus:border-gold';

  return (
    <textarea
      className={`w-full rounded-md border px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 ${errorStyles} ${className}`}
      {...rest}
    />
  );
}

export function FieldFeedback({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
      <span>⚠️</span>
      <span>{error}</span>
    </p>
  );
}

export function AdminAlert({
  type = 'error',
  message,
  onClose
}: {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    error: 'border-red-500/20 bg-red-500/10 text-red-300',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-300'
  }[type];

  const icons = {
    error: '❌',
    success: '✅',
    info: 'ℹ️'
  }[type];

  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <div className="flex items-center gap-2">
        <span>{icons}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function AdminModal({
  title,
  isOpen,
  onClose,
  children
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[rgba(20,20,20,0.98)] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-gold">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-xl border border-white/[0.06] bg-[rgba(15,15,15,0.92)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
      <table className="w-full min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-neutral-500">
            {head.map((h) => (
              <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'ok' | 'warn' | 'neutral' }) {
  const tones: Record<string, string> = {
    ok: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    warn: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    neutral: 'bg-white/5 text-neutral-400 border-white/10'
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}