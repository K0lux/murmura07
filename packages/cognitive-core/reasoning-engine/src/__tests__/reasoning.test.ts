import { describe, expect, it } from 'vitest';
import { StrategicReasoningAgent } from '../index.js';

const agent = new StrategicReasoningAgent();

describe('StrategicReasoningAgent', () => {
  it('returns a decision object', async () => {
    const decision = await agent.reason({});
    expect(decision.selectedStrategy).toBeTruthy();
    expect(decision.confidence).toBeGreaterThan(0);
  });
});
