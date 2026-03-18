import { describe, expect, it } from 'vitest';
import { HealthScoreEngine } from '../agent/health.score.engine.js';

const engine = new HealthScoreEngine();

describe('HealthScoreEngine', () => {
  it('computes a score within bounds', () => {
    const score = engine.compute(0.8, 0.2, 0.5, 0.9);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
