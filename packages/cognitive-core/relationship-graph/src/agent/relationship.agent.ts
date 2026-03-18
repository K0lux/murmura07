import { RelationshipNode } from '@murmura/cognitive-core-shared';

export class RelationshipAgent {
  create(interlocuteurId: string, name: string): RelationshipNode {
    return {
      id: interlocuteurId,
      name,
      type: 'peer',
      trustLevel: 0.5,
      accumulatedTension: 0.0,
      healthScore: 80,
      interactionFrequency: { days7: 1, days30: 1 },
      pendingPromises: []
    };
  }
}
