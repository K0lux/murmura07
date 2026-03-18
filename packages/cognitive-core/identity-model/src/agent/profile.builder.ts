import { IdentityModel } from '@murmura/cognitive-core-shared';

export class ProfileBuilder {
  build(userId: string): IdentityModel {
    return {
      userId,
      communicationStyle: {
        formality: 'medium',
        tone: 'neutral'
      },
      confrontationLevel: 0.5,
      riskTolerance: 0.5,
      recurringBiases: [],
      typicalMistakes: [],
      longTermObjectives: [],
      coreValues: ['respect', 'clarté'],
      updatedAt: new Date(),
      version: 1
    };
  }
}
