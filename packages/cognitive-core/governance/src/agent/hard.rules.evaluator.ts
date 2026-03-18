import { Decision, GovernanceRule, Violation } from '@murmura/cognitive-core-shared';
import { HARD_RULES } from '@murmura/cognitive-core-shared';

export class HardRulesEvaluator {
  evaluate(decision: Decision): Violation[] {
    const violations: Violation[] = [];
    for (const rule of HARD_RULES) {
      if (rule.check(decision)) {
        violations.push({ rule: this.toRule(rule), severity: 'block', description: rule.description });
      }
    }
    return violations;
  }

  private toRule(rule: { id: string; description: string }): GovernanceRule {
    return { id: rule.id, description: rule.description, category: 'hard' };
  }
}
