import { describe, expect, it } from 'vitest';
import { IdentityModelAgent } from '../index.js';

const agent = new IdentityModelAgent();

describe('IdentityModelAgent', () => {
  it('builds an initial profile', async () => {
    const model = await agent.buildInitial('user_test');
    expect(model.userId).toBe('user_test');
    expect(model.version).toBeGreaterThan(0);
  });
});
