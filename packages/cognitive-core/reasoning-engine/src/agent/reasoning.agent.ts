import { Decision } from '@murmura/cognitive-core-shared';
import { Contextualizer } from './contextualizer.js';
import { StrategyEvaluator } from './strategy.evaluator.js';
import { RecommendationBuilder } from './recommendation.builder.js';

export class StrategicReasoningAgent {
  private contextualizer = new Contextualizer();
  private evaluator = new StrategyEvaluator();
  private builder = new RecommendationBuilder();

  async reason(input: unknown): Promise<Decision> {
    const enriched = this.contextualizer.enrich(input);
    const scored = this.evaluator.evaluate(enriched);
    return this.builder.build(scored);
  }
}

