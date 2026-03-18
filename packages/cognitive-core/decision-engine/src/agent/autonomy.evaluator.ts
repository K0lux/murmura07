import { AutonomyConfig, AutonomyLevel, Decision, MessageAnalysis } from '@murmura/cognitive-core-shared';

export class AutonomyEvaluator {
  evaluate(config: AutonomyConfig, analysis: MessageAnalysis): AutonomyLevel {
    for (const rule of config.rules.sort((a, b) => b.priority - a.priority)) {
      if (rule.condition === 'tensionScore > 0.7' && analysis.tensionScore > 0.7) {
        return rule.level;
      }
      if (rule.condition === 'trustLevel < 0.3') {
        return rule.level;
      }
    }
    return config.defaultLevel;
  }

  requiresValidation(level: AutonomyLevel): boolean {
    return level === 'validation_required' || level === 'blocked';
  }

  isAutonomyAllowed(level: AutonomyLevel): boolean {
    return level === 'limited_autonomy';
  }

  apply(decision: Decision, level: AutonomyLevel): Decision {
    return {
      ...decision,
      autonomyAllowed: this.isAutonomyAllowed(level),
      requiresValidation: this.requiresValidation(level)
    };
  }
}
