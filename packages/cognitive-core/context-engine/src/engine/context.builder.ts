import { ConversationContext } from '@murmura/cognitive-core-shared';

export class ContextBuilder {
  buildBase(): ConversationContext {
    return {
      previousPromises: [],
      conflictHistory: [],
      relationshipState: { trustLevel: 0.5, tension: 0.2 },
      activeObjectives: [],
      summary: 'Contexte synthétique minimal',
      relevantPatterns: []
    };
  }
}
