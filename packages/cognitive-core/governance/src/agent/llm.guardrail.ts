import { Decision, Violation } from '@murmura/cognitive-core-shared';

interface RiskScore {
  manipulation: number;
  deception: number;
  aggression: number;
  overreach: number;
}

export class LlmGuardrail {
  evaluate(decision: Decision): Promise<Violation[]> {
    const content = (decision.suggestedReply ?? '').toLowerCase();
    const scores = this.score(content);
    const violations: Violation[] = [];

    if (scores.manipulation > 0.6) {
      violations.push({
        rule: { id: 'no_manipulation', description: 'No manipulation', category: 'hard' },
        severity: 'block',
        description: 'Manipulation risk score high.'
      });
    }

    if (scores.deception > 0.6) {
      violations.push({
        rule: { id: 'no_deception', description: 'No deception', category: 'hard' },
        severity: 'block',
        description: 'Deception risk score high.'
      });
    }

    if (scores.aggression > 0.6) {
      violations.push({
        rule: { id: 'no_harassment', description: 'No harassment', category: 'hard' },
        severity: 'block',
        description: 'Aggression risk score high.'
      });
    }

    if (scores.overreach > 0.6) {
      violations.push({
        rule: { id: 'no_overreach', description: 'No overreach', category: 'hard' },
        severity: 'block',
        description: 'Overreach risk score high.'
      });
    }

    return Promise.resolve(violations);
  }

  private score(content: string): RiskScore {
    return {
      manipulation: this.keywordScore(content, ['manipuler', 'pression', 'culpabiliser']),
      deception: this.keywordScore(content, ['mensonge', 'faux', 'tromper']),
      aggression: this.keywordScore(content, ['insulte', 'menace', 'violence']),
      overreach: this.keywordScore(content, ['pirater', 'acceder sans accord', 'surveillance'])
    };
  }

  private keywordScore(content: string, keywords: string[]): number {
    const hits = keywords.filter((keyword) => content.includes(keyword)).length;
    return Math.min(1, hits / Math.max(1, keywords.length / 2));
  }
}
