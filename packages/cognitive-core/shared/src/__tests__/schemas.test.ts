import { describe, expect, it } from 'vitest';
import {
  RawMessageSchema,
  MessageAnalysisSchema,
  RecommendationSchema,
  SimulationResultSchema,
  AlertSchema,
  MurmuraResponseSchema,
  AutonomyConfigSchema,
  ConversationContextSchema,
  IdentityModelSchema,
  RelationshipNodeSchema,
  DecisionSchema,
  GovernanceResultSchema,
  EpisodeSchema,
  MemorySearchResultSchema,
  MurmuraRequestSchema,
  ErrorResponseSchema
} from '../index.js';

describe('RawMessageSchema', () => {
  it('accepts valid input', () => {
    const parsed = RawMessageSchema.parse({
      userId: 'u1',
      canal: 'email',
      interlocuteurId: 'i1',
      content: 'Hello',
      metadata: { timestamp: new Date(), urgencyFlag: false }
    });
    expect(parsed.userId).toBe('u1');
  });

  it('rejects empty content', () => {
    expect(() =>
      RawMessageSchema.parse({
        userId: 'u1',
        canal: 'email',
        interlocuteurId: 'i1',
        content: '',
        metadata: { timestamp: new Date(), urgencyFlag: false }
      })
    ).toThrow();
  });
});

describe('MessageAnalysisSchema', () => {
  it('accepts valid input', () => {
    const parsed = MessageAnalysisSchema.parse({
      intention: 'information',
      emotion: { dominant: 'neutral', intensity: 0.2 },
      tensionScore: 0.2,
      explicitDemand: 'ask',
      urgencyLevel: 'low',
      powerAsymmetry: { direction: 'balanced', intensity: 0.1 },
      ambiguityScore: 0.1
    });
    expect(parsed.intention).toBe('information');
  });

  it('rejects out-of-range scores', () => {
    expect(() =>
      MessageAnalysisSchema.parse({
        intention: 'information',
        emotion: { dominant: 'neutral', intensity: 1.2 },
        tensionScore: 0.2,
        explicitDemand: 'ask',
        urgencyLevel: 'low',
        powerAsymmetry: { direction: 'balanced', intensity: 0.1 },
        ambiguityScore: 0.1
      })
    ).toThrow();
  });
});

describe('RecommendationSchema', () => {
  it('accepts valid recommendation', () => {
    const parsed = RecommendationSchema.parse({
      strategy: 'respond_diplomatic',
      rationale: 'maintain trust',
      confidence: 0.8
    });
    expect(parsed.strategy).toBe('respond_diplomatic');
  });

  it('rejects missing rationale', () => {
    expect(() =>
      RecommendationSchema.parse({
        strategy: 'respond_direct',
        confidence: 0.5
      })
    ).toThrow();
  });
});

describe('SimulationResultSchema', () => {
  it('accepts valid scenario', () => {
    const parsed = SimulationResultSchema.parse({
      scenario: 'respond_direct',
      acceptanceProbability: 0.7,
      escalationProbability: 0.1,
      trustImpact: 0.2,
      longTermImpact: 'neutral'
    });
    expect(parsed.escalationProbability).toBe(0.1);
  });

  it('rejects invalid probabilities', () => {
    expect(() =>
      SimulationResultSchema.parse({
        scenario: 'respond_direct',
        acceptanceProbability: 1.2,
        escalationProbability: 0.1,
        trustImpact: 0.2,
        longTermImpact: 'neutral'
      })
    ).toThrow();
  });
});

describe('AlertSchema', () => {
  it('accepts valid alert', () => {
    const parsed = AlertSchema.parse({
      type: 'high_tension',
      severity: 'warning',
      message: 'Tension high',
      triggeredBy: 'tensionScore'
    });
    expect(parsed.severity).toBe('warning');
  });

  it('rejects empty message', () => {
    expect(() =>
      AlertSchema.parse({
        type: 'high_tension',
        severity: 'warning',
        message: '',
        triggeredBy: 'tensionScore'
      })
    ).toThrow();
  });
});

describe('MurmuraResponseSchema', () => {
  it('accepts valid response', () => {
    const parsed = MurmuraResponseSchema.parse({
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
        rationale: 'answer clearly',
        confidence: 0.6
      },
      simulations: [],
      alerts: [],
      autonomyAllowed: false
    });
    expect(parsed.requestId).toBe('r1');
  });
});

describe('AutonomyConfigSchema', () => {
  it('accepts valid config', () => {
    const parsed = AutonomyConfigSchema.parse({
      userId: 'u1',
      defaultLevel: 'suggestion_only',
      rules: []
    });
    expect(parsed.defaultLevel).toBe('suggestion_only');
  });
});

describe('ConversationContextSchema', () => {
  it('accepts minimal context', () => {
    const parsed = ConversationContextSchema.parse({
      previousPromises: [],
      conflictHistory: [],
      relationshipState: { trustLevel: 0.5, tension: 0.2 },
      activeObjectives: [],
      summary: 'ok',
      relevantPatterns: []
    });
    expect(parsed.summary).toBe('ok');
  });

  it('rejects invalid trustLevel', () => {
    expect(() =>
      ConversationContextSchema.parse({
        previousPromises: [],
        conflictHistory: [],
        relationshipState: { trustLevel: 1.2, tension: 0.2 },
        activeObjectives: [],
        summary: 'ok',
        relevantPatterns: []
      })
    ).toThrow();
  });
});

describe('IdentityModelSchema', () => {
  it('accepts valid identity', () => {
    const parsed = IdentityModelSchema.parse({
      userId: 'u1',
      communicationStyle: { formality: 'medium', tone: 'neutral' },
      confrontationLevel: 0.3,
      riskTolerance: 0.4,
      recurringBiases: [],
      typicalMistakes: [],
      longTermObjectives: [],
      coreValues: ['clarity'],
      updatedAt: new Date(),
      version: 1
    });
    expect(parsed.version).toBe(1);
  });
});

describe('RelationshipNodeSchema', () => {
  it('accepts valid relationship', () => {
    const parsed = RelationshipNodeSchema.parse({
      id: 'r1',
      userId: 'u1',
      interlocuteurId: 'i1',
      trustLevel: 0.5,
      accumulatedTension: 0.2,
      powerAsymmetry: { direction: 'balanced', intensity: 0.1 },
      interactionFrequency: { last7days: 1, last30days: 4, averageResponseTime: 120 },
      sensitiveTopics: [],
      pendingPromises: [],
      relationshipType: 'professional_peer',
      healthScore: 70,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    expect(parsed.healthScore).toBe(70);
  });
});

describe('DecisionSchema', () => {
  it('accepts valid decision', () => {
    const parsed = DecisionSchema.parse({
      id: 'd1',
      requestId: 'r1',
      timestamp: new Date(),
      selectedStrategy: 'respond_direct',
      alternativeReplies: [],
      alerts: [],
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: 'explain',
      confidence: 0.6
    });
    expect(parsed.id).toBe('d1');
  });
});

describe('GovernanceResultSchema', () => {
  it('accepts valid result', () => {
    const parsed = GovernanceResultSchema.parse({
      allowed: true,
      violations: []
    });
    expect(parsed.allowed).toBe(true);
  });
});

describe('EpisodeSchema', () => {
  it('accepts valid episode', () => {
    const parsed = EpisodeSchema.parse({
      id: 'e1',
      userId: 'u1',
      type: 'event',
      content: 'note',
      embedding: [0.1, 0.2],
      importance: 0.6,
      decayFactor: 0.9,
      tags: ['tag'],
      relatedEntities: ['x'],
      createdAt: new Date()
    });
    expect(parsed.type).toBe('event');
  });
});

describe('MemorySearchResultSchema', () => {
  it('accepts valid result', () => {
    const parsed = MemorySearchResultSchema.parse({
      snippet: 'hello',
      source: 'MEMORY.md',
      lineRange: [1, 2],
      score: 0.4,
      sourceType: 'memory'
    });
    expect(parsed.sourceType).toBe('memory');
  });
});

describe('MurmuraRequestSchema', () => {
  it('accepts valid request', () => {
    const parsed = MurmuraRequestSchema.parse({
      requestId: 'r1',
      message: {
        userId: 'u1',
        canal: 'email',
        interlocuteurId: 'i1',
        content: 'Hello',
        metadata: { timestamp: new Date(), urgencyFlag: false }
      }
    });
    expect(parsed.requestId).toBe('r1');
  });
});

describe('ErrorResponseSchema', () => {
  it('accepts valid error response', () => {
    const parsed = ErrorResponseSchema.parse({
      requestId: 'r1',
      error: { code: 'ERR', message: 'fail' }
    });
    expect(parsed.error.code).toBe('ERR');
  });
});

