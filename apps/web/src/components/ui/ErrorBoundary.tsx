import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Murmura UI error', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="auth-shell">
          <div className="auth-card stack">
            <strong>Une erreur de rendu est survenue.</strong>
            <p className="muted">Rechargez l’interface pour reprendre la session.</p>
            <Button onClick={() => window.location.reload()}>Recharger</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
