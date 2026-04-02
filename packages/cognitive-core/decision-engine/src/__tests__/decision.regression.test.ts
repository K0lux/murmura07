import { describe, expect, it, vi } from 'vitest';
import { DecisionAssembler } from '../agent/decision.assembler.js';
import { DecisionOrchestrationAgent } from '../agent/decision.agent.js';
import { AutonomyEvaluator } from '../agent/autonomy.evaluator.js';
import type {
  Alert,
  AutonomyConfig,
  GovernanceResult,
  MessageAnalysis,
  Recommendation,
  SimulationResult
} from '@murmura/cognitive-core-shared';

const analysis: MessageAnalysis = {
  intention: 'request',
  emotion: { dominant: 'pressure', intensity: 0.5 },
  tensionScore: 0.35,
  explicitDemand: 'clarify priorities',
  implicitDemand: 'Clarifier le besoin',
  urgencyLevel: 'medium',
  powerAsymmetry: { direction: 'balanced', intensity: 0.2 },
  ambiguityScore: 0.65
};

const recommendation: Recommendation = {
  strategy: 'ask_clarification',
  rationale: 'High ambiguity requires clarification before acting.',
  confidence: 0.82,
  suggestedReply: "Peux-tu me preciser la priorite principale et l'echeance ?"
};

const autonomyConfig: AutonomyConfig = {
  userId: 'user-1',
  defaultLevel: 'suggestion_only',
  rules: [{ condition: 'ambiguityScore > 0.6', level: 'validation_required', priority: 5 }]
};

const simulations: SimulationResult[] = [];
const alerts: Alert[] = [];

describe('Decision engine regression', () => {
  it('keeps suggestion-bearing recommendations mapped into decisions', () => {
    const assembler = new DecisionAssembler();
    const decision = assembler.assemble({
      requestId: 'decision-request-1',
      analysis,
      recommendation,
      simulations,
      alerts
    });

    expect(decision.selectedStrategy).toBe('ask_clarification');
    expect(decision.suggestedReply).toBe(recommendation.suggestedReply);
    expect(decision.explanation).toBe(recommendation.rationale);
    expect(decision.confidence).toBe(recommendation.confidence);
  });

  it('does not block the response path when persistence fails asynchronously', async () => {
    const persist = vi.fn(async () => {
      throw new Error('persist failed');
    });
    const check = vi.fn(async (): Promise<GovernanceResult> => ({ allowed: true, violations: [] }));

    const agent = new DecisionOrchestrationAgent(
      new DecisionAssembler(),
      new AutonomyEvaluator(),
      { check } as never,
      { persist } as never
    );

    const decision = await agent.decide({
      userId: 'user-1',
      requestId: 'decision-request-2',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(decision.selectedStrategy).toBe('ask_clarification');
    expect(decision.suggestedReply).toBeDefined();
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('preserves a soft-warning flow by keeping the suggestion when governance allows it', async () => {
    const persist = vi.fn(async () => undefined);
    const check = vi.fn(async (): Promise<GovernanceResult> => ({
      allowed: true,
      violations: [{ code: 'tone-watch', severity: 'medium', message: 'Tone should stay neutral' }]
    }));

    const agent = new DecisionOrchestrationAgent(
      new DecisionAssembler(),
      new AutonomyEvaluator(),
      { check } as never,
      { persist } as never
    );

    const decision = await agent.decide({
      userId: 'user-1',
      requestId: 'decision-request-3',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(decision.suggestedReply).toBe(recommendation.suggestedReply);
    expect(decision.requiresValidation).toBe(false);
  });
});
