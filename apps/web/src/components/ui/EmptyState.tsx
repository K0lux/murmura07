import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface stack" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 42 }}>◎</div>
      <strong>{title}</strong>
      <p className="muted" style={{ margin: 0 }}>
        {description}
      </p>
      {action}
    </div>
  );
}
