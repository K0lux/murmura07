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
});

