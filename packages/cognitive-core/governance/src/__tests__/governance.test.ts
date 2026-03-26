import { describe, expect, it, vi } from 'vitest';
import { GovernanceAgent } from '../agent/governance.agent.js';
import type { Decision, Violation } from '@murmura/cognitive-core-shared';

const decision: Decision = {
  id: 'd1',
  requestId: 'r1',
  timestamp: new Date('2026-03-18T12:00:00.000Z'),
  selectedStrategy: 'respond_direct',
  suggestedReply: 'Message de test',
  alternativeReplies: [],
  alerts: [],
  autonomyAllowed: false,
  requiresValidation: true,
  explanation: 'test',
  confidence: 0.4
};

describe('GovernanceAgent', () => {
  it('blocks immediately when hard rules trigger', async () => {
    const logger = { log: vi.fn() };
    const agent = new GovernanceAgent(
      {
        evaluate: () =>
          [
            {
              rule: { id: 'no_harassment', description: 'No harassment', category: 'hard' },
              severity: 'block',
              description: 'Aggressive message detected.'
            }
          ] satisfies Violation[]
      } as never,
      { evaluate: vi.fn(async () => []) } as never,
      { evaluate: vi.fn(async () => []) } as never,
      logger as never
    );

    const result = await agent.check(decision, 'user1');

    expect(result.allowed).toBe(false);
    expect(result.blockedReason).toBe('hard_rules');
    expect(result.violations).toHaveLength(1);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('merges soft-rule and guardrail violations and blocks the decision', async () => {
    const logger = { log: vi.fn() };
    const softViolation: Violation = {
      rule: { id: 'avoid_late_messages', description: 'Avoid late messages', category: 'soft' },
      severity: 'warning',
      description: 'Late-night sending window.'
    };
    const guardrailViolation: Violation = {
      rule: { id: 'no_manipulation', description: 'No manipulation', category: 'hard' },
      severity: 'block',
      description: 'Manipulation risk score high.'
    };

    const agent = new GovernanceAgent(
      { evaluate: () => [] } as never,
      { evaluate: vi.fn(async () => [softViolation]) } as never,
      { evaluate: vi.fn(async () => [guardrailViolation]) } as never,
      logger as never
    );

    const result = await agent.check(decision, 'user1');

    expect(result.allowed).toBe(false);
    expect(result.blockedReason).toBe('guardrail');
    expect(result.violations).toEqual([softViolation, guardrailViolation]);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it('allows decisions when no violations are found', async () => {
    const logger = { log: vi.fn() };
    const agent = new GovernanceAgent(
      { evaluate: () => [] } as never,
      { evaluate: vi.fn(async () => []) } as never,
      { evaluate: vi.fn(async () => []) } as never,
      logger as never
    );

    const result = await agent.check(decision, 'user1');

    expect(result).toEqual({ allowed: true, violations: [] });
    expect(logger.log).not.toHaveBeenCalled();
  });

  it('fails closed when an internal governance dependency throws', async () => {
    const agent = new GovernanceAgent(
      { evaluate: () => [] } as never,
      {
        evaluate: vi.fn(async () => {
          throw new Error('soft rules unavailable');
        })
      } as never,
      { evaluate: vi.fn(async () => []) } as never,
      { log: vi.fn() } as never
    );

    const result = await agent.check(decision, 'user1');

    expect(result.allowed).toBe(false);
    expect(result.blockedReason).toBe('governance_error');
    expect(result.violations).toEqual([]);
  });
});
