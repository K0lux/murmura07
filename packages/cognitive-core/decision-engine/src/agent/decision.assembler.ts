import { Decision, MessageAnalysis, Recommendation, SimulationResult, Alert } from '@murmura/cognitive-core-shared';

export class DecisionAssembler {
  assemble(input: {
    requestId: string;
    analysis: MessageAnalysis;
    recommendation: Recommendation;
    simulations: SimulationResult[];
    alerts: Alert[];
  }): Decision {
    return {
      id: `decision_${Date.now()}`,
      requestId: input.requestId,
      timestamp: new Date(),
      selectedStrategy: input.recommendation.strategy,
      suggestedReply: input.recommendation.suggestedReply,
      alternativeReplies: [],
      alerts: input.alerts,
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: input.recommendation.rationale,
      confidence: input.recommendation.confidence,
      simulations: input.simulations
    };
  }
}
