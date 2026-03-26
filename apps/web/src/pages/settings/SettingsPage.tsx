import { Button } from '../../components/ui/Button';
import { useRoute } from '../../utils/router';

const settingsLinks = [
  { href: '/settings/profile', label: 'Profil' },
  { href: '/settings/channels', label: 'Canaux' },
  { href: '/settings/autonomy', label: 'Autonomie' },
  { href: '/settings/governance', label: 'Gouvernance' }
];

export function SettingsPage() {
  const { navigate } = useRoute();

  return (
    <div className="surface stack">
      <h2 style={{ margin: 0 }}>Parametres</h2>
      <p className="muted" style={{ margin: 0 }}>
        Navigation laterale vers le profil, les canaux, l’autonomie, la gouvernance,
        la memoire et les integrations.
      </p>
      <div className="row">
        {settingsLinks.map((item) => (
          <Button key={item.href} variant="secondary" onClick={() => navigate(item.href)}>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
