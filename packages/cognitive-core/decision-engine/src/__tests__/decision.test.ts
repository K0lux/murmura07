import { describe, expect, it } from 'vitest';
import { DecisionOrchestrationAgent } from '../agent/decision.agent.js';

const agent = new DecisionOrchestrationAgent();

describe('DecisionOrchestrationAgent', () => {
  it('applies autonomy rules', async () => {
    const decision = await agent.decide({
      userId: 'user1',
      requestId: 'r1',
      analysis: {
        intention: 'information',
        emotion: { dominant: 'neutral', intensity: 0.2 },
        tensionScore: 0.9,
        explicitDemand: 'ask',
        urgencyLevel: 'high',
        powerAsymmetry: { direction: 'balanced', intensity: 0.2 },
        ambiguityScore: 0.4
      },
      recommendation: {
        strategy: 'respond_diplomatic',
        rationale: 'tension high',
        confidence: 0.6
      },
      simulations: [],
      alerts: [],
      autonomyConfig: {
        userId: 'user1',
        defaultLevel: 'suggestion_only',
        rules: [{ condition: 'tensionScore > 0.7', level: 'blocked', priority: 10 }]
      }
    });

    expect(decision.requiresValidation).toBe(true);
  });
});

