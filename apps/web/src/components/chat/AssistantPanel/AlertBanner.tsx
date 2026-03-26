import { Badge } from '../../ui/Badge';
import { useAnalysis } from '../../../hooks/useAnalysis';

export function AlertBanner() {
  const { alerts } = useAnalysis();
  const alert = alerts[0];

  if (!alert) {
    return null;
  }

  return (
    <div className="card row-between" style={{ borderColor: 'rgba(171, 61, 51, 0.35)' }}>
      <div>
        <strong>{alert.type}</strong>
        <div className="muted">{alert.message}</div>
      </div>
      <Badge tone={alert.severity === 'warning' ? 'warning' : 'error'}>{alert.severity}</Badge>
    </div>
  );
}
