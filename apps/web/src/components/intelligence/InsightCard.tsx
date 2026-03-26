import { Button } from '../ui/Button';

export function InsightCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card stack">
      <strong>{title}</strong>
      <p className="muted" style={{ margin: 0 }}>
        {description}
      </p>
      <div className="row">
        <Button size="sm">Valider</Button>
        <Button size="sm" variant="secondary">
          Rejeter
        </Button>
      </div>
    </div>
  );
}
