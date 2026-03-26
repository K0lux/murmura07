import { useMemo, useState } from 'react';
import { HealthScoreGauge } from '../../components/intelligence/HealthScoreGauge';
import { TimelineEvent } from '../../components/intelligence/TimelineEvent';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useRelationship } from '../../hooks/useRelationship';
import { useRoute } from '../../utils/router';

export function RelationshipDetailPage() {
  const { pathname } = useRoute();
  const interlocuteurId = useMemo(
    () => pathname.replace('/intelligence/relationships/', '') || null,
    [pathname]
  );
  const { relationship, isLoading, isSaving, error, saveNotes } = useRelationship(interlocuteurId);
  const [notes, setNotes] = useState('');

  if (isLoading) {
    return <div className="surface">Chargement de la fiche relationnelle...</div>;
  }

  if (error) {
    return (
      <div className="surface" style={{ color: 'var(--danger)' }}>
        {error}
      </div>
    );
  }

  if (!relationship) {
    return (
      <EmptyState
        title="Relation introuvable"
        description="Cette fiche n'existe pas encore dans le store cognitif."
      />
    );
  }

  return (
    <div className="stack">
      <HealthScoreGauge value={relationship.healthScore} />
      <div className="surface stack">
        <h2 style={{ marginTop: 0 }}>Fiche relationnelle</h2>
        <div className="muted">Interlocuteur: {relationship.interlocuteurId}</div>
        <div>Type: {relationship.relationshipType}</div>
        <div>Confiance: {Math.round(relationship.trustLevel * 100)} / 100</div>
        <div>Tension accumulee: {Math.round(relationship.accumulatedTension * 100)} / 100</div>
        <div>Sujets sensibles: {relationship.sensitiveTopics.join(', ') || 'Aucun'}</div>
        <div>Promesses en attente: {relationship.pendingPromises.length}</div>
      </div>
      <div className="surface stack">
        <strong>Notes rapides</strong>
        <textarea
          className="textarea"
          rows={5}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Ajoutez une note relationnelle a synchroniser avec l'API..."
        />
        <div className="row">
          <Button loading={isSaving} onClick={() => void saveNotes(notes)}>
            Enregistrer les notes
          </Button>
        </div>
      </div>
      <TimelineEvent
        date={new Date(relationship.updatedAt).toLocaleDateString('fr-FR')}
        label="Derniere mise a jour"
        description={`La fiche a ete actualisee avec ${relationship.interactionFrequency.last30days} interactions sur 30 jours.`}
      />
    </div>
  );
}
