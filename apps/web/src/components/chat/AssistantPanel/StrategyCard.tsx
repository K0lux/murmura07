import { Badge } from '../../ui/Badge';
import { useAnalysis } from '../../../hooks/useAnalysis';

export function StrategyCard() {
  const { recommendation } = useAnalysis();

  if (!recommendation) {
    return null;
  }

  const tone =
    recommendation.confidence >= 0.75
      ? 'success'
      : recommendation.confidence >= 0.5
        ? 'warning'
        : 'info';

  return (
    <div className="card stack">
      <div className="row-between">
        <strong>Strategie recommandee</strong>
        <Badge tone={tone}>Confiance {Math.round(recommendation.confidence * 100)}%</Badge>
      </div>
      <div>Strategie: {recommendation.strategy}</div>
      <p className="muted" style={{ margin: 0 }}>
        {recommendation.rationale}
      </p>
    </div>
  );
}
