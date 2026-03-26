import { Badge } from '../../ui/Badge';
import { useAnalysis } from '../../../hooks/useAnalysis';
import { EmptyState } from '../../ui/EmptyState';

export function AnalysisCard() {
  const { analysis } = useAnalysis();

  if (!analysis) {
    return (
      <EmptyState
        title="Analyse en attente"
        description="Envoyez un premier message dans une conversation pour afficher l'analyse cognitive reelle."
      />
    );
  }

  return (
    <div className="card stack">
      <div className="row-between">
        <strong>Analyse</strong>
        <Badge tone="info">{analysis.intent}</Badge>
      </div>
      <div className="muted">Tension detectee: {Math.round(analysis.tensionScore * 100)} / 100</div>
      <div>Emotion dominante: {analysis.emotion}</div>
      <div>Demande implicite: {analysis.implicitNeed}</div>
      <div>Urgence: {analysis.urgencyLevel}</div>
      <div>Asymetrie de pouvoir: {analysis.powerDirection}</div>
    </div>
  );
}
