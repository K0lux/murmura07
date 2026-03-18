import { TokenEstimator } from './token.estimator.js';

export class CompactionTrigger {
  constructor(
    private readonly estimator = new TokenEstimator(),
    private readonly softLimit = 1800
  ) {}

  shouldCompact(content: string): boolean {
    return this.estimator.estimate(content) > this.softLimit;
  }
}

