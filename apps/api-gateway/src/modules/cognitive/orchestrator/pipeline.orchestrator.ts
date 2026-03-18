import { CircuitBreaker } from './circuit.breaker.js';
import { withRetry } from './retry.policy.js';
import {
  Alert,
  AutonomyConfig,
  MessageAnalysis,
  Recommendation,
  SimulationResult,
  Decision
} from '@murmura/cognitive-core-shared';
import { DecisionOrchestrationAgent } from '@murmura/cognitive-core-decision-engine';

export class PipelineOrchestrator {
  constructor(
    private readonly decisionAgent = new DecisionOrchestrationAgent(),
    private readonly breaker = new CircuitBreaker()
  ) {}

  async run(input: {
    userId: string;
    requestId: string;
    analysis: MessageAnalysis;
    recommendation: Recommendation;
    simulations: SimulationResult[];
    alerts: Alert[];
    autonomyConfig: AutonomyConfig;
  }): Promise<Decision> {
    if (!this.breaker.canExecute()) {
      return this.degradedDecision(input);
    }

    try {
      const decision = await withRetry(() => this.decisionAgent.decide(input), 2, 500);
      this.breaker.onSuccess();
      return decision;
    } catch {
      this.breaker.onFailure();
      return this.degradedDecision(input);
    }
  }

  private async degradedDecision(input: {
    userId: string;
    requestId: string;
    analysis: MessageAnalysis;
    recommendation: Recommendation;
    simulations: SimulationResult[];
    alerts: Alert[];
    autonomyConfig: AutonomyConfig;
  }): Promise<Decision> {
    return {
      id: `decision_${Date.now()}`,
      requestId: input.requestId,
      timestamp: new Date(),
      selectedStrategy: input.recommendation.strategy,
      suggestedReply: undefined,
      alternativeReplies: [],
      alerts: input.alerts,
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: 'Decision degraded due to pipeline failure.',
      confidence: 0.3,
      simulations: []
    };
  }
}

