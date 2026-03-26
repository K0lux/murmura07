import { Badge } from '../../ui/Badge';
import { Tooltip } from '../../ui/Tooltip';
import { useAnalysis } from '../../../hooks/useAnalysis';

export function AutonomyBadge() {
  const { autonomyAllowed } = useAnalysis();

  return (
    <Tooltip
      content={
        autonomyAllowed
          ? 'L API autorise actuellement une autonomie limitee.'
          : 'L API exige encore une validation humaine.'
      }
    >
      <span>
        <Badge tone={autonomyAllowed ? 'success' : 'warning'}>
          {autonomyAllowed ? 'Autonomie limitee' : 'Validation requise'}
        </Badge>
      </span>
    </Tooltip>
  );
}
