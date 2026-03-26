import { describe, expect, it, vi } from 'vitest';
import { DecisionOrchestrationAgent } from '../agent/decision.agent.js';
import { AutonomyEvaluator } from '../agent/autonomy.evaluator.js';
import { DecisionAssembler } from '../agent/decision.assembler.js';
import type {
  Alert,
  AutonomyConfig,
  Decision,
  GovernanceResult,
  MessageAnalysis,
  Recommendation,
  SimulationResult
} from '@murmura/cognitive-core-shared';

const analysis: MessageAnalysis = {
  intention: 'information',
  emotion: { dominant: 'neutral', intensity: 0.2 },
  tensionScore: 0.9,
  explicitDemand: 'ask',
  urgencyLevel: 'high',
  powerAsymmetry: { direction: 'balanced', intensity: 0.2 },
  ambiguityScore: 0.4
};

const recommendation: Recommendation = {
  strategy: 'respond_diplomatic',
  rationale: 'tension high',
  confidence: 0.6,
  suggestedReply: 'Prenons un moment pour clarifier calmement.'
};

const autonomyConfig: AutonomyConfig = {
  userId: 'user1',
  defaultLevel: 'suggestion_only',
  rules: [{ condition: 'tensionScore > 0.7', level: 'blocked', priority: 10 }]
};

const simulations: SimulationResult[] = [];
const alerts: Alert[] = [];

describe('AutonomyEvaluator', () => {
  it('applies the highest-priority matching rule', () => {
    const evaluator = new AutonomyEvaluator();

    const level = evaluator.evaluate(
      {
        userId: 'user1',
        defaultLevel: 'suggestion_only',
        rules: [
          { condition: 'trustLevel < 0.3', level: 'validation_required', priority: 1 },
          { condition: 'tensionScore > 0.7', level: 'blocked', priority: 10 }
        ]
      },
      analysis
    );

    expect(level).toBe('blocked');
  });

  it('marks blocked decisions as requiring validation and not autonomous', () => {
    const evaluator = new AutonomyEvaluator();
    const baseDecision = new DecisionAssembler().assemble({
      requestId: 'r1',
      analysis,
      recommendation,
      simulations,
      alerts
    });

    const decision = evaluator.apply(baseDecision, 'blocked');

    expect(decision.requiresValidation).toBe(true);
    expect(decision.autonomyAllowed).toBe(false);
  });
});

describe('DecisionAssembler', () => {
  it('maps recommendation fields into a decision payload', () => {
    const assembler = new DecisionAssembler();
    const now = new Date('2026-03-18T12:00:00.000Z');
    const originalDateNow = Date.now;

    Date.now = () => now.getTime();

    try {
      const decision = assembler.assemble({
        requestId: 'request-123',
        analysis,
        recommendation,
        simulations,
        alerts
      });

      expect(decision.id).toBe(`decision_${now.getTime()}`);
      expect(decision.requestId).toBe('request-123');
      expect(decision.selectedStrategy).toBe('respond_diplomatic');
      expect(decision.suggestedReply).toBe(recommendation.suggestedReply);
      expect(decision.explanation).toBe(recommendation.rationale);
      expect(decision.simulations).toEqual([]);
    } finally {
      Date.now = originalDateNow;
    }
  });
});

describe('DecisionOrchestrationAgent', () => {
  it('persists the decision after a successful governance check', async () => {
    const persist = vi.fn(async () => undefined);
    const check = vi.fn(async (): Promise<GovernanceResult> => ({ allowed: true, violations: [] }));

    const agent = new DecisionOrchestrationAgent(
      new DecisionAssembler(),
      new AutonomyEvaluator(),
      { check } as never,
      { persist } as never
    );

    const decision = await agent.decide({
      userId: 'user1',
      requestId: 'r1',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(check).toHaveBeenCalledTimes(1);
    expect(persist).toHaveBeenCalledTimes(1);
    expect(decision.requiresValidation).toBe(true);
  });

  it('returns a blocked decision when governance rejects the output', async () => {
    const persist = vi.fn(async () => undefined);
    const check = vi.fn(async (): Promise<GovernanceResult> => ({
      allowed: false,
      violations: [],
      blockedReason: 'guardrail'
    }));

    const agent = new DecisionOrchestrationAgent(
      new DecisionAssembler(),
      new AutonomyEvaluator(),
      { check } as never,
      { persist } as never
    );

    const decision = await agent.decide({
      userId: 'user1',
      requestId: 'r2',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(decision.suggestedReply).toBeUndefined();
    expect(decision.explanation).toBe('guardrail');
    expect(persist).not.toHaveBeenCalled();
  });

  it('falls back to generic blocked reason when governance omits one', async () => {
    const agent = new DecisionOrchestrationAgent(
      new DecisionAssembler(),
      new AutonomyEvaluator(),
      {
        check: async (): Promise<GovernanceResult> => ({
          allowed: false,
          violations: []
        })
      } as never,
      { persist: async () => undefined } as never
    );

    const decision = await agent.decide({
      userId: 'user1',
      requestId: 'r3',
      analysis,
      recommendation,
      simulations,
      alerts,
      autonomyConfig
    });

    expect(decision.explanation).toBe('blocked');
  });
});
