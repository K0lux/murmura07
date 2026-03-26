import { Input } from '../ui/Input';

export function MemorySearchBar({
  query,
  onQueryChange,
  isLoading,
  error
}: {
  query: string;
  onQueryChange: (value: string) => void;
  isLoading?: boolean;
  error?: string | null;
}) {
  return (
    <div className="stack">
      <Input
        label="Recherche semantique"
        placeholder="Promesses, conflits, moments-clefs..."
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {isLoading ? <div className="muted">Recherche en cours...</div> : null}
      {error ? <div style={{ color: 'var(--danger)' }}>{error}</div> : null}
    </div>
  );
}
