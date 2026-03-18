export function normalizeContent(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}

export function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return `${hash}`;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
