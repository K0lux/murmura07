import { RelationshipCard } from '../../components/intelligence/RelationshipCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRelationships } from '../../hooks/useRelationship';
import { useRoute } from '../../utils/router';

function formatRelationshipType(type: string) {
  return type
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function RelationshipsPage() {
  const { navigate } = useRoute();
  const { relationships, isLoading, error } = useRelationships();

  if (isLoading) {
    return <div className="surface">Chargement des relations...</div>;
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
        title="Aucune relation indexee"
        description="Les fiches relationnelles apparaitront ici quand l'API aura accumule des interactions."
      />
    );
  }

  return (
    <div className="stack">
      {relationships.map((relationship) => (
        <button
          key={relationship.id}
          onClick={() => navigate(`/intelligence/relationships/${relationship.interlocuteurId}`)}
          style={{ all: 'unset', cursor: 'pointer' }}
        >
          <RelationshipCard
            name={relationship.interlocuteurId}
            type={formatRelationshipType(relationship.relationshipType)}
            score={relationship.healthScore}
          />
        </button>
      ))}
    </div>
  );
}
