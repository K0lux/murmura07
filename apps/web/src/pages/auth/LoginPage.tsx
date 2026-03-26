import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from '../../utils/router';

export function LoginPage() {
  const { login } = useAuth();
  const { navigate } = useRoute();
  const [email, setEmail] = useState('demo@murmura.app');
  const [password, setPassword] = useState('password');
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
        placeholder="mot de passe"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={error ?? undefined}
      />
      <Button
        loading={loading}
        onClick={async () => {
          setError(null);
          setLoading(true);
          try {
            await login(email, password);
          } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : 'Connexion impossible');
          } finally {
            setLoading(false);
          }
        }}
      >
        Se connecter
      </Button>
      <Button variant="ghost" onClick={() => navigate('/register')}>
        Creer un compte
      </Button>
    </div>
  );
}
