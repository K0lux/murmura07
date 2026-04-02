import type { ReactNode } from 'react';
import { BrandMark } from '../branding/BrandMark';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-card stack">
        <div className="stack" style={{ gap: 12 }}>
          <div className="auth-brand-row">
            <span className="auth-brand-mark">
              <BrandMark />
            </span>
            <div className="stack" style={{ gap: 4 }}>
              <span className="auth-brand-title">Messagerie augmentee</span>
              <strong style={{ fontSize: '1.35rem', letterSpacing: '-0.03em' }}>Murmura</strong>
            </div>
          </div>
          <h1 style={{ margin: 0 }}>Piloter les relations avec plus de clarte.</h1>
          <p className="muted" style={{ margin: 0 }}>
            Une conversation privee, une memoire relationnelle durable et une interface
            alignee sur la charte Murmura.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
