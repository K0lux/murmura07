import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export function RelationshipCard({
  name,
  score,
  type
}: {
  name: string;
  score: number;
  type: string;
}) {
  return (
    <div className="card row-between">
      <div className="row">
        <Avatar name={name} />
        <div>
          <strong>{name}</strong>
          <div className="muted">{type}</div>
        </div>
      </div>
      <Badge tone={score > 75 ? 'success' : score > 50 ? 'warning' : 'error'}>{score}</Badge>
    </div>
  );
}
