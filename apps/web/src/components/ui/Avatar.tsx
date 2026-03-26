export function Avatar({ name, size = 'md' }: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56
  }[size];

  return (
    <div
      aria-label={name}
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(11, 110, 79, 0.12)',
        color: 'var(--primary)',
        fontWeight: 700
      }}
    >
      {name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()}
    </div>
  );
}
