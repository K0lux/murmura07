import { Bias, BiasType } from '@murmura/cognitive-core-shared';
import { PatternMiner } from './pattern.miner.js';
import { BiasClassifier } from './bias.classifier.js';
import { InsightBuilder } from './insight.builder.js';

export class BiasDetector {
  private miner = new PatternMiner();
  private classifier = new BiasClassifier();
  private builder = new InsightBuilder();

  detect(): Bias[] {
    const patterns = this.miner.mine();
    if (patterns.length === 0) {
      return [];
    }

    const biasType = this.classifier.classify(patterns[0] ?? '');
    const bias: Bias = {
      type: biasType as BiasType,
      description: this.builder.build(biasType).description,
      frequency: 0.2,
      lastSeen: new Date()
    };
    return [bias];
  }
}
