import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-card stack">
        <div className="stack" style={{ gap: 8 }}>
          <span className="pill">Murmura</span>
          <h1 style={{ margin: 0 }}>Piloter les relations avec plus de clarté.</h1>
          <p className="muted" style={{ margin: 0 }}>
            Interface frontend React + Vite prete pour l’authentification, la messagerie
            assistee et l’intelligence relationnelle.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
