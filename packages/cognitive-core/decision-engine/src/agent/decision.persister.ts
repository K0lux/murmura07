import { Decision } from '@murmura/cognitive-core-shared';
import { MemoryFlusher } from '@murmura/cognitive-core-memory';

export class DecisionPersister {
  constructor(private readonly flusher = new MemoryFlusher()) {}

  async persist(userId: string, decision: Decision) {
    await this.flusher.flush(userId, `Decision ${decision.id}: ${decision.explanation}`);
  }
}
