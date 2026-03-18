import { Decision, Violation, GovernanceRule } from '@murmura/cognitive-core-shared';

interface SoftRule {
  id: string;
  description: string;
  predicate: (decision: Decision) => boolean;
  severity: 'warning' | 'block';
}

const DEFAULT_RULES: SoftRule[] = [
  {
    id: 'avoid_late_messages',
    description: 'Eviter les messages apres 20h.',
    predicate: () => {
      const hour = new Date().getHours();
      return hour >= 20;
    },
    severity: 'warning'
  }
];

export class SoftRulesEvaluator {
  constructor(private readonly rules: SoftRule[] = DEFAULT_RULES) {}

  async evaluate(decision: Decision): Promise<Violation[]> {
    const violations: Violation[] = [];
    for (const rule of this.rules) {
      if (rule.predicate(decision)) {
        const governanceRule: GovernanceRule = {
          id: rule.id,
          description: rule.description,
          category: 'soft'
        };
        violations.push({ rule: governanceRule, severity: rule.severity, description: rule.description });
      }
    }
    return violations;
  }
}
