import { HealthScoreGauge } from '../../components/intelligence/HealthScoreGauge';
import { TensionChart } from '../../components/intelligence/TensionChart';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useRelationships } from '../../hooks/useRelationship';

export function DashboardPage() {
  const { relationships, isLoading, error } = useRelationships();

  if (isLoading) {
    return <div className="surface">Chargement du dashboard...</div>;
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
        title="Dashboard en attente"
        description="Le tableau de bord se remplira quand des relations reelles seront calculees par l'API."
      />
    );
  }

  const averageHealth = Math.round(
    relationships.reduce((sum, relationship) => sum + relationship.healthScore, 0) /
      relationships.length
  );
  const activeAlerts = relationships.filter((relationship) => relationship.accumulatedTension > 0.7).length;
  const pendingPromises = relationships.reduce(
    (sum, relationship) =>
      sum + relationship.pendingPromises.filter((promise) => promise.status === 'pending').length,
    0
  );

  return (
    <div className="stack">
      <div className="metric-grid">
        <HealthScoreGauge value={averageHealth} />
        <div className="card stack">
          <strong>Alertes actives</strong>
          <Badge tone={activeAlerts > 0 ? 'warning' : 'success'}>
            {activeAlerts} signaux a surveiller
          </Badge>
        </div>
        <div className="card stack">
          <strong>Promesses en attente</strong>
          <Badge tone="info">{pendingPromises} engagements suivis</Badge>
        </div>
      </div>
      <TensionChart />
    </div>
  );
}
