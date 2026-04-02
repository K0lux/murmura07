import { Decision, GovernanceResult, Violation } from '@murmura/cognitive-core-shared';
import { HardRulesEvaluator } from './hard.rules.evaluator.js';
import { SoftRulesEvaluator } from './soft.rules.evaluator.js';
import { LlmGuardrail } from './llm.guardrail.js';
import { ViolationLogger } from './violation.logger.js';

export class GovernanceAgent {
  constructor(
    private readonly hardRules = new HardRulesEvaluator(),
    private readonly softRules = new SoftRulesEvaluator(),
    private readonly guardrail = new LlmGuardrail(),
    private readonly logger = new ViolationLogger()
  ) {}

  async check(decision: Decision, userId?: string): Promise<GovernanceResult> {
    try {
      const hardViolations = this.hardRules.evaluate(decision);
      if (hardViolations.length) {
        this.logger.log(userId, decision, hardViolations);
        return { allowed: false, violations: hardViolations, blockedReason: 'hard_rules' };
      }

      const softViolations = await this.softRules.evaluate(decision);
      const guardrailViolations = await this.guardrail.evaluate(decision);
      const allViolations: Violation[] = [...softViolations, ...guardrailViolations];

      if (allViolations.length) {
        this.logger.log(userId, decision, allViolations);
        const blockingViolations = allViolations.filter((violation) => violation.severity === 'block');
        if (blockingViolations.length) {
          return { allowed: false, violations: allViolations, blockedReason: 'guardrail' };
        }

        return { allowed: true, violations: allViolations };
      }

      return { allowed: true, violations: [] };
    } catch {
      return {
        allowed: false,
        violations: [],
        blockedReason: 'governance_error'
      };
    }
  }
}

