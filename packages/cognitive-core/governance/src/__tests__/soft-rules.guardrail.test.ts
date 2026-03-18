import { describe, expect, it, vi } from 'vitest';
import { SoftRulesEvaluator } from '../agent/soft.rules.evaluator.js';
import { LlmGuardrail } from '../agent/llm.guardrail.js';
import { Decision } from '@murmura/cognitive-core-shared';

const baseDecision: Decision = {
  id: 'd1',
  requestId: 'r1',
  timestamp: new Date(),
  selectedStrategy: 'respond_direct',
  suggestedReply: 'ok',
  alternativeReplies: [],
  alerts: [],
  autonomyAllowed: false,
  requiresValidation: true,
  explanation: 'test',
  confidence: 0.5
};

describe('SoftRulesEvaluator', () => {
  it('flags late messages after 20h', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T20:30:00Z'));

    const evaluator = new SoftRulesEvaluator();
    const violations = await evaluator.evaluate(baseDecision);

    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]?.rule.category).toBe('soft');

    vi.useRealTimers();
  });
});

describe('LlmGuardrail', () => {
  it('detects manipulation risks above threshold', async () => {
    const guardrail = new LlmGuardrail();
    const decision: Decision = {
      ...baseDecision,
      suggestedReply: 'Je vais te manipuler et te mettre la pression.'
    };

    const violations = await guardrail.evaluate(decision);
    expect(violations.some((v) => v.rule.id === 'no_manipulation')).toBe(true);
  });
});

