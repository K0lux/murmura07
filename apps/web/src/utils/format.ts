export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export function formatRelativeTime(value: Date | string) {
  const now = Date.now();
  const date = new Date(value).getTime();
  const diffHours = Math.round((date - now) / (1000 * 60 * 60));

  if (Math.abs(diffHours) < 24) {
    return `${Math.abs(diffHours)}h`;
  }

  return formatDate(value);
}

export function formatScore(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function truncate(value: string, maxLength = 80) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}
