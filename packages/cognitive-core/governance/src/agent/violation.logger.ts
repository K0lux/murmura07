import { Decision, Violation } from '@murmura/cognitive-core-shared';
import { MemoryFlusher } from '@murmura/cognitive-core-memory';

export class ViolationLogger {
  constructor(private readonly flusher = new MemoryFlusher()) {}

  log(userId: string | undefined, decision: Decision, violations: Violation[]) {
    if (!userId) {
      return;
    }
    const summary = violations.map((v) => `- ${v.rule.id}: ${v.description}`).join('\n');
    void this.flusher.flush(userId, `Decision ${decision.id} violation(s):\n${summary}`);
  }
}
