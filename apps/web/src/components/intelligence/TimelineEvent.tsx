export function TimelineEvent({
  date,
  label,
  description
}: {
  date: string;
  label: string;
  description: string;
}) {
  return (
    <div className="card stack">
      <div className="row-between">
        <strong>{label}</strong>
        <span className="muted">{date}</span>
      </div>
      <div>{description}</div>
    </div>
  );
}
