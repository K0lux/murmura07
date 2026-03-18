import { Chunk } from './chunker.js';

export interface HybridScore {
  chunk: Chunk;
  bm25Score: number;
  vectorScore: number;
  combinedScore: number;
}

export function mergeHybridScores(
  scores: HybridScore[],
  weights: { bm25: number; vector: number }
): HybridScore[] {
  return scores
    .map((score) => ({
      ...score,
      combinedScore: score.bm25Score * weights.bm25 + score.vectorScore * weights.vector
    }))
    .sort((a, b) => b.combinedScore - a.combinedScore);
}

