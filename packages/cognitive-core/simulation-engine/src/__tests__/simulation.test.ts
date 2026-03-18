import { describe, expect, it } from 'vitest';
import { SimulationAgent } from '../index.js';

const agent = new SimulationAgent();

describe('SimulationAgent', () => {
  it('returns an array of simulations', () => {
    const result = agent.simulate();
    expect(Array.isArray(result)).toBe(true);
  });
});
