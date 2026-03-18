export const DEFAULTS = {
  autonomyLevel: 'suggestion_only',
  contextMode: 'partial',
  embeddingModel: 'local',
  chunkSizeTokens: 400,
  chunkOverlapTokens: 80,
  maxSearchResults: 6,
  cacheMaxEntries: 50000
} as const;
