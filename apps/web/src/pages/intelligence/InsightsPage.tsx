import { InsightCard } from '../../components/intelligence/InsightCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRelationships } from '../../hooks/useRelationship';

export function InsightsPage() {
  const { relationships, isLoading, error } = useRelationships();

  if (isLoading) {
    return <div className="surface">Chargement des insights...</div>;
  }

  if (error) {
    return (
      <div className="surface" style={{ color: 'var(--danger)' }}>
        {error}
      </div>
    );
  }

  if (relationships.length === 0) {
    return (
      <EmptyState
        title="Pas encore d'insights"
        description="Les insights apparaitront ici des que des relations reelles seront disponibles."
      />
    );
  }

  const mostTense = [...relationships].sort(
    (left, right) => right.accumulatedTension - left.accumulatedTension
  )[0];
  const strongest = [...relationships].sort((left, right) => right.healthScore - left.healthScore)[0];

  return (
    <div className="stack">
      <InsightCard
        title="Point de vigilance"
        description={`La relation avec ${mostTense.interlocuteurId} concentre actuellement le plus de tension (${Math.round(
          mostTense.accumulatedTension * 100
        )}/100).`}
      />
      <InsightCard
        title="Relation la plus solide"
        description={`${strongest.interlocuteurId} presente le meilleur score de sante relationnelle (${strongest.healthScore}/100).`}
      />
    </div>
  );
}
