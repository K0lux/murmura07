export function HealthScoreGauge({ value }: { value: number }) {
  return (
    <div className="card stack">
      <strong>Health Score</strong>
      <div style={{ fontSize: 40, color: 'var(--primary)' }}>{value}</div>
      <div className="muted">Indice composite confiance, stabilite et reciprocite.</div>
    </div>
  );
}
