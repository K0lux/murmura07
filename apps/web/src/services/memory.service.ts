import { apiClient } from './api.client';

export type MemorySearchResult = {
  snippet: string;
  source: string;
  lineRange: [number, number];
  score: number;
  sourceType: 'memory' | 'session';
};

export type MemoryFile = {
  path: string;
  startLine: number;
  lines: string[];
};

export async function searchMemory(query: string, options?: { limit?: number; sources?: string[] }) {
  const params = new URLSearchParams({ query });

  if (options?.limit !== undefined) {
    params.set('limit', String(options.limit));
  }

  if (options?.sources?.length) {
    params.set('sources', options.sources.join(','));
  }

  return apiClient<MemorySearchResult[]>(`/v1/memory/search?${params.toString()}`);
}

export async function getMemoryFile(path: string, options?: { startLine?: number; numLines?: number }) {
  const params = new URLSearchParams({ path });

  if (options?.startLine !== undefined) {
    params.set('startLine', String(options.startLine));
  }

  if (options?.numLines !== undefined) {
    params.set('numLines', String(options.numLines));
  }

  return apiClient<MemoryFile>(`/v1/memory/get?${params.toString()}`);
}
