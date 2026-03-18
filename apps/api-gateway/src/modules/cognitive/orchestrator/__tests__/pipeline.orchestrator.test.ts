import { describe, expect, it } from 'vitest';
import { PipelineOrchestrator } from '../pipeline.orchestrator.js';

class ThrowingAgent {
  async decide() {
    throw new Error('fail');
  }
}

describe('PipelineOrchestrator', () => {
  it('returns degraded decision when breaker is open', async () => {
    const orchestrator = new PipelineOrchestrator(new ThrowingAgent() as never);
    const decision = await orchestrator.run({
      userId: 'user1',
      requestId: 'r1',
      analysis: {
        intention: 'information',
        emotion: { dominant: 'neutral', intensity: 0.2 },
        tensionScore: 0.2,
        explicitDemand: 'ask',
        urgencyLevel: 'low',
        powerAsymmetry: { direction: 'balanced', intensity: 0.1 },
        ambiguityScore: 0.1
      },
      recommendation: {
        strategy: 'respond_direct',
        rationale: 'ok',
        confidence: 0.6
      },
      simulations: [],
      alerts: [],
      autonomyConfig: {
        userId: 'user1',
        defaultLevel: 'suggestion_only',
        rules: []
      }
    });

    expect(decision.explanation).toContain('degraded');
  });
});

