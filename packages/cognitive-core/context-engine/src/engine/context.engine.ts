import { ConversationContext } from '@murmura/cognitive-core-shared';
import { ContextBuilder } from './context.builder.js';
import { ContextReconstructor } from './context.reconstructor.js';

interface CacheEntry {
  context: ConversationContext;
  updatedAt: number;
  dirty: boolean;
}

export class ContextEngine {
  private cache = new Map<string, CacheEntry>();
  private ttlMs = 5 * 60 * 1000;

  constructor(
    private readonly builder = new ContextBuilder(),
    private readonly reconstructor = new ContextReconstructor()
  ) {}

  buildContext(userId: string, threadId: string): ConversationContext {
    const key = `${userId}:${threadId}`;
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && !cached.dirty && now - cached.updatedAt < this.ttlMs) {
      return cached.context;
    }

    const context = this.builder.buildBase();
    this.cache.set(key, { context, updatedAt: now, dirty: false });
    this.reconstructor.reset();
    return context;
  }

  notifyWorkspaceChanged(userId: string) {
    this.reconstructor.markDirty();
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(`${userId}:`)) {
        this.cache.set(key, { ...entry, dirty: true });
      }
    }
  }

  clear(userId: string, threadId: string) {
    this.cache.delete(`${userId}:${threadId}`);
  }
}

