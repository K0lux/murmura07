import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [style, setStyle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="stack">
      <Input
        label="Email"
        type="email"
        placeholder="vous@murmura.app"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Mot de passe"
        type="password"
        placeholder="Choisissez un mot de passe"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Input
        label="Nom d'affichage"
        placeholder="Votre nom"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />
      <Input
        label="Style de communication"
        placeholder="Direct, empathique, concis..."
        value={style}
        onChange={(event) => setStyle(event.target.value)}
        error={error ?? undefined}
      />
      <Button
        loading={loading}
        onClick={async () => {
          setError(null);
          setLoading(true);
          try {
            await register({
              email,
              password,
              firstName: displayName || undefined,
              preferredCommunicationStyle: style || undefined
            });
          } catch (registerError) {
            setError(registerError instanceof Error ? registerError.message : 'Inscription impossible');
          } finally {
            setLoading(false);
          }
        }}
      >
        Initialiser le workspace
      </Button>
    </div>
  );
}
