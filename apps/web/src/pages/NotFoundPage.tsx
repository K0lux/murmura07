import { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useRoute } from '../utils/router';

export function NotFoundPage() {
  const { pathname, navigate } = useRoute();

  useEffect(() => {
    console.warn('Unknown Murmura route', pathname);
  }, [pathname]);

  return (
    <EmptyState
      title="Page introuvable"
      description={`Aucune vue n’est configuree pour ${pathname}.`}
      action={<Button onClick={() => navigate('/chat')}>Retour au chat</Button>}
    />
  );
}
