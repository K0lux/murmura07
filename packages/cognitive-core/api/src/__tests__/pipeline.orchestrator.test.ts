import { describe, expect, it, vi } from 'vitest';
import type {
  Alert,
  AutonomyConfig,
  Decision,
  MessageAnalysis,
  Recommendation,
  SimulationResult
} from '@murmura/cognitive-core-shared';
import { PipelineOrchestrator } from '../orchestrator/pipeline.orchestrator.js';

const analysis: MessageAnalysis = {
  intention: 'information',
  emotion: { dominant: 'neutral', intensity: 0.1 },
  tensionScore: 0.8,
  explicitDemand: 'clarify',
  urgencyLevel: 'medium',
  powerAsymmetry: { direction: 'balanced', intensity: 0.1 },
  ambiguityScore: 0.2
};

const recommendation: Recommendation = {
  strategy: 'respond_diplomatic',
  rationale: 'default',
  confidence: 0.7,
  suggestedReply: 'Merci, je prends un instant pour clarifier.'
};

const autonomyConfig: AutonomyConfig = {
  userId: 'user-1',
  defaultLevel: 'suggestion_only',
  rules: []
};

const simulations: SimulationResult[] = [];
const alerts: Alert[] = [];

const buildInput = () => ({
  userId: 'user-1',
  requestId: 'request-1',
  analysis,
  recommendation,
  simulations,
  alerts,
  autonomyConfig
});

describe('PipelineOrchestrator', () => {
  it('returns the agent decision when every step succeeds', async () => {
    const decision: Decision = {
      id: 'decision_1',
      requestId: 'request-1',
      timestamp: new Date('2026-03-18T12:00:00.000Z'),
      selectedStrategy: 'respond_diplomatic',
      alternativeReplies: [],
      alerts: [],
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: 'ok',
      confidence: 0.6,
      simulations: []
    };

    const decide = vi.fn(async () => decision);
    const orchestrator = new PipelineOrchestrator({ decide });

    await expect(orchestrator.run(buildInput())).resolves.toEqual(decision);
    expect(decide).toHaveBeenCalledTimes(1);
  });

  it('degrades to a safe fallback decision when the decision step fails', async () => {
    const orchestrator = new PipelineOrchestrator({
      decide: vi.fn(async () => {
        throw new Error('boom');
      })
    });

    const result = await orchestrator.run(buildInput());

    expect(result.selectedStrategy).toBe('defer');
    expect(result.autonomyAllowed).toBe(false);
    expect(result.requiresValidation).toBe(true);
    expect(result.suggestedReply).toBeUndefined();
    expect((result as Decision & { degraded?: boolean }).degraded).toBe(true);
  });

  it('falls back when a parallel preparation step times out', async () => {
    const decision: Decision = {
      id: 'decision_2',
      requestId: 'request-1',
      timestamp: new Date('2026-03-18T12:00:00.000Z'),
      selectedStrategy: 'defer',
      alternativeReplies: [],
      alerts: [],
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: 'timed-out',
      confidence: 0.2,
      simulations: []
    };

    const decide = vi.fn(async (input: ReturnType<typeof buildInput>) => ({
      ...decision,
      selectedStrategy: input.recommendation.strategy
    }));

    const orchestrator = new PipelineOrchestrator(
      { decide },
      {
        recommendationResolver: async () => {
          await new Promise((resolve) => setTimeout(resolve, 20));
          return recommendation;
        },
        stepConfig: {
          recommendation: { timeoutMs: 1, retries: 0 }
        }
      }
    );

    const result = await orchestrator.run(buildInput());

    expect(result.selectedStrategy).toBe('defer');
    expect((result as Decision & { degradedReason?: string }).degradedReason).toContain(
      'recommendation_unavailable'
    );
  });
});
