import { describe, expect, it } from 'vitest';
import { ContextEngine } from '../engine/context.engine.js';

describe('ContextEngine', () => {
  it('returns cached context when not dirty', () => {
    const engine = new ContextEngine();
    const first = engine.buildContext('u1', 't1');
    const second = engine.buildContext('u1', 't1');
    expect(first).toBe(second);
  });

  it('rebuilds context after dirty notification', () => {
    const engine = new ContextEngine();
    const first = engine.buildContext('u1', 't1');
    engine.notifyWorkspaceChanged('u1');
    const second = engine.buildContext('u1', 't1');
    expect(first).not.toBe(second);
  });

  it('rebuilds context after cache ttl expires', () => {
    const now = Date.now();
    let currentTime = now;

    const originalNow = Date.now;
    Date.now = () => currentTime;

    try {
      const engine = new ContextEngine();
      const first = engine.buildContext('u1', 't1');

      currentTime += 5 * 60 * 1000 + 1;

      const second = engine.buildContext('u1', 't1');
      expect(first).not.toBe(second);
    } finally {
      Date.now = originalNow;
    }
  });

  it('marks only the targeted user cache entries as dirty', () => {
    const engine = new ContextEngine();

    const firstUser = engine.buildContext('u1', 't1');
    const secondUser = engine.buildContext('u2', 't1');

    engine.notifyWorkspaceChanged('u1');

    const firstUserAfterChange = engine.buildContext('u1', 't1');
    const secondUserAfterChange = engine.buildContext('u2', 't1');

    expect(firstUserAfterChange).not.toBe(firstUser);
    expect(secondUserAfterChange).toBe(secondUser);
  });

  it('clears a specific cached context explicitly', () => {
    const engine = new ContextEngine();
    const first = engine.buildContext('u1', 'thread-a');

    engine.clear('u1', 'thread-a');

    const second = engine.buildContext('u1', 'thread-a');
    expect(second).not.toBe(first);
  });
});

