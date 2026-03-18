import { Decision } from '@murmura/cognitive-core-shared';

export class RecommendationBuilder {
  build(result: { strategy: string }): Decision {
    return {
      id: `dec_${Date.now()}`,
      requestId: `req_${Date.now()}`,
      timestamp: new Date(),
      selectedStrategy: result.strategy as Decision['selectedStrategy'],
      suggestedReply: 'Réponse suggérée.',
      alternativeReplies: [],
      alerts: [],
      autonomyAllowed: false,
      requiresValidation: true,
      explanation: 'Recommandation basée sur le contexte.',
      confidence: 0.5
    };
  }
}
