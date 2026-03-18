import { Chunk } from './chunker.js';

export interface IndexState {
  fileHashes: Map<string, string>;
  lastIndexedAt: Date | null;
}

export function createIndexState(): IndexState {
  return {
    fileHashes: new Map<string, string>(),
    lastIndexedAt: null
  };
}

export function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return `${hash}`;
}

export function mergeChunks(existing: Chunk[], updates: Chunk[]): Chunk[] {
  const map = new Map(existing.map((chunk) => [chunk.id, chunk]));
  for (const chunk of updates) {
    map.set(chunk.id, chunk);
  }
  return Array.from(map.values());
}

