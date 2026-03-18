export interface Chunk {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
}

export interface ChunkerOptions {
  maxLines?: number;
  overlapLines?: number;
}

export function chunkMarkdown(
  filePath: string,
  content: string,
  options: ChunkerOptions = {}
): Chunk[] {
  const maxLines = options.maxLines ?? 20;
  const overlapLines = options.overlapLines ?? 3;
  const lines = content.split(/\r?\n/);
  const chunks: Chunk[] = [];

  let start = 0;
  while (start < lines.length) {
    const end = Math.min(lines.length, start + maxLines);
    const slice = lines.slice(start, end).join('\n').trim();
    if (slice) {
      chunks.push({
        id: `${filePath}:${start + 1}-${end}`,
        filePath,
        startLine: start + 1,
        endLine: end,
        content: slice
      });
    }
    start = end - overlapLines;
    if (start < 0) {
      start = end;
    }
  }

  return chunks;
}
