import { afterEach, describe, expect, it, vi } from 'vitest';
import { SoftRulesEvaluator } from '../agent/soft.rules.evaluator.js';
import { LlmGuardrail } from '../agent/llm.guardrail.js';
import type { Decision } from '@murmura/cognitive-core-shared';

const baseDecision: Decision = {
  id: 'd1',
  requestId: 'r1',
  timestamp: new Date('2026-03-18T12:00:00.000Z'),
  selectedStrategy: 'respond_direct',
  suggestedReply: 'ok',
  alternativeReplies: [],
  alerts: [],
  autonomyAllowed: false,
  requiresValidation: true,
  explanation: 'test',
  confidence: 0.5
};

afterEach(() => {
  vi.useRealTimers();
});

describe('SoftRulesEvaluator', () => {
  it('flags late messages after 20h with a soft warning', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T20:30:00Z'));

    const evaluator = new SoftRulesEvaluator();
    const violations = await evaluator.evaluate(baseDecision);

    expect(violations).toHaveLength(1);
    expect(violations[0]?.rule.id).toBe('avoid_late_messages');
    expect(violations[0]?.rule.category).toBe('soft');
    expect(violations[0]?.severity).toBe('warning');
  });

  it('does not flag late-message rule during business hours', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T14:00:00Z'));

    const evaluator = new SoftRulesEvaluator();
    const violations = await evaluator.evaluate(baseDecision);

    expect(violations).toEqual([]);
  });

  it('supports custom executable soft rules', async () => {
    const evaluator = new SoftRulesEvaluator([
      {
        id: 'force_validation',
        description: 'Always require validation.',
        severity: 'block',
        predicate: (decision) => decision.requiresValidation
      }
    ]);

    const violations = await evaluator.evaluate(baseDecision);

    expect(violations).toHaveLength(1);
    expect(violations[0]?.rule.id).toBe('force_validation');
    expect(violations[0]?.severity).toBe('block');
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

    expect(violations.some((violation) => violation.rule.id === 'no_manipulation')).toBe(true);
  });

  it('detects multiple risk categories in the same reply', async () => {
    const guardrail = new LlmGuardrail();
    const decision: Decision = {
      ...baseDecision,
      suggestedReply: 'On va te manipuler, te tromper avec un faux pretexte et te menacer.'
    };

    const violations = await guardrail.evaluate(decision);
    const ids = violations.map((violation) => violation.rule.id);

    expect(ids).toContain('no_manipulation');
    expect(ids).toContain('no_deception');
    expect(ids).toContain('no_harassment');
  });

  it('returns no violations for neutral content below thresholds', async () => {
    const guardrail = new LlmGuardrail();

    const violations = await guardrail.evaluate({
      ...baseDecision,
      suggestedReply: 'Merci, je te propose de reprendre calmement demain matin.'
    });

    expect(violations).toEqual([]);
  });
});
