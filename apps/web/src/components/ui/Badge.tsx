import type { ReactNode } from 'react';

export function Badge({
  tone = 'neutral',
  children
}: {
  tone?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  children: ReactNode;
}) {
  const colors: Record<string, string> = {
    info: 'var(--primary)',
    success: '#246b3c',
    warning: 'var(--warning)',
    error: 'var(--danger)',
    neutral: 'var(--muted)'
  };

  return (
    <span className="pill" style={{ color: colors[tone] }}>
      {children}
    </span>
  );
}
