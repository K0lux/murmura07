export function Skeleton({ height = 16 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 999,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.12), rgba(0,0,0,0.06))'
      }}
    />
  );
}
