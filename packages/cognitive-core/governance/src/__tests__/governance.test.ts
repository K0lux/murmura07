import { describe, expect, it } from 'vitest';
import { GovernanceAgent } from '../agent/governance.agent.js';

const agent = new GovernanceAgent();

describe('GovernanceAgent', () => {
  it('blocks decision when hard rule triggers', async () => {
    const decision = {
      id: 'd1',
      requestId: 'r1',
      timestamp: new Date(),
      selectedStrategy: 'respond_direct',
      suggestedReply: 'Ceci est une insulte.',
      alternativeReplies: [],
      alerts: [],
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: 'test',
      confidence: 0.4
    } as const;

    const result = await agent.check(decision, 'user1');
    expect(result.allowed).toBe(false);
    expect(result.blockedReason).toBe('hard_rules');
  });
});

