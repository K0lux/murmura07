import { describe, expect, it, vi } from 'vitest';
import { PipelineOrchestrator } from '../pipeline.orchestrator.js';
import type {
  Alert,
  AutonomyConfig,
  Decision,
  MessageAnalysis,
  Recommendation,
  SimulationResult
} from '@murmura/cognitive-core-shared';

const analysis: MessageAnalysis = {
  intention: 'information',
  emotion: { dominant: 'neutral', intensity: 0.2 },
  tensionScore: 0.2,
  explicitDemand: 'ask',
  urgencyLevel: 'low',
  powerAsymmetry: { direction: 'balanced', intensity: 0.1 },
  ambiguityScore: 0.1
};

const recommendation: Recommendation = {
  strategy: 'respond_direct',
  rationale: 'ok',
  confidence: 0.6,
  suggestedReply: 'Voici la reponse.'
};

const simulations: SimulationResult[] = [];
const alerts: Alert[] = [];
const autonomyConfig: AutonomyConfig = {
  userId: 'user1',
  defaultLevel: 'suggestion_only',
  rules: []
};

function createDecision(explanation = 'healthy'): Decision {
  return {
    id: 'decision-1',
    requestId: 'r1',
    timestamp: new Date('2026-03-18T12:00:00.000Z'),
    selectedStrategy: 'respond_direct',
    suggestedReply: 'Voici la reponse.',
    alternativeReplies: [],
    alerts: [],
    autonomyAllowed: false,
    requiresValidation: true,
    explanation,
    confidence: 0.8,
    simulations: []
  };
}

describe('PipelineOrchestrator', () => {
  it('returns degraded decision immediately when breaker is open', async () => {
    const orchestrator = new PipelineOrchestrator(
      { decide: vi.fn(async () => createDecision()) } as never,
      { canExecute: () => false, onSuccess: vi.fn(), onFailure: vi.fn() } as never
    );

    const decision = await orchestrator.run({
      userId: 'user1',
      requestId: 'r1',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(decision.explanation).toContain('degraded');
    expect(decision.suggestedReply).toBeUndefined();
  });

  it('returns the agent decision and records success when execution succeeds', async () => {
    const onSuccess = vi.fn();
    const decide = vi.fn(async () => createDecision('pipeline ok'));

    const orchestrator = new PipelineOrchestrator(
      { decide } as never,
      { canExecute: () => true, onSuccess, onFailure: vi.fn() } as never
    );

    const decision = await orchestrator.run({
      userId: 'user1',
      requestId: 'r1',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(decision.explanation).toBe('pipeline ok');
    expect(decide).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('degrades gracefully and records a breaker failure when the agent throws', async () => {
    const onFailure = vi.fn();
    const orchestrator = new PipelineOrchestrator(
      {
        decide: vi.fn(async () => {
          throw new Error('transient failure');
        })
      } as never,
      { canExecute: () => true, onSuccess: vi.fn(), onFailure } as never
    );

    const decision = await orchestrator.run({
      userId: 'user1',
      requestId: 'r1',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(decision.explanation).toContain('degraded');
    expect(decision.confidence).toBe(0.3);
  });
});
