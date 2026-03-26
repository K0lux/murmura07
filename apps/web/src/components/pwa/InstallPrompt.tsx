import { useState } from 'react';
import { usePwa } from '../../hooks/usePwa';
import { Button } from '../ui/Button';

export function InstallPrompt() {
  const { canInstall, isOffline, install } = usePwa();
  const [dismissed, setDismissed] = useState(false);

  if ((!canInstall && !isOffline) || dismissed) {
    return null;
  }

  return (
    <div className="install-banner">
      <div>
        <strong>{isOffline ? 'Mode hors ligne actif' : 'Installer Murmura'}</strong>
        <div className="muted">
          {isOffline
            ? 'Le shell de messagerie reste accessible meme avec une connexion faible.'
            : 'Ajoutez l’app a l’ecran d’accueil pour une experience plein ecran web et mobile.'}
        </div>
      </div>
      <div className="row">
        {canInstall ? <Button onClick={() => void install()}>Installer</Button> : null}
        <Button variant="ghost" onClick={() => setDismissed(true)}>
          Fermer
        </Button>
      </div>
    </div>
  );
}
