import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`animate-fade-up relative z-10 w-full max-w-[620px] rounded-2xl border border-white/[0.06] bg-[rgba(20,20,20,0.85)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}
