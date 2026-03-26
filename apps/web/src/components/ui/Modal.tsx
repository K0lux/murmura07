import type { ReactNode } from 'react';

export function Modal({
  open,
  title,
  children
}: {
  open: boolean;
  title: string;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="auth-shell" style={{ position: 'fixed', inset: 0 }}>
      <div className="auth-card">
        <div className="row-between">
          <strong>{title}</strong>
        </div>
        <div className="stack" style={{ marginTop: 16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
