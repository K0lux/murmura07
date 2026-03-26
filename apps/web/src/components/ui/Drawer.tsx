import type { ReactNode } from 'react';

export function Drawer({
  open,
  title,
  children
}: {
  open: boolean;
  title: string;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <aside className="surface" style={{ position: 'sticky', top: 24 }}>
      <div className="row-between">
        <strong>{title}</strong>
      </div>
      <div className="stack" style={{ marginTop: 16 }}>
        {children}
      </div>
    </aside>
  );
}
