import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { IdentityModelAgent } from '../index.js';

const agent = new IdentityModelAgent();
const originalWorkspaceRoot = process.env.WORKSPACE_ROOT;
let tempWorkspaceRoot: string | undefined;

afterEach(async () => {
  if (tempWorkspaceRoot) {
    await fs.rm(tempWorkspaceRoot, { recursive: true, force: true });
    tempWorkspaceRoot = undefined;
  }

  if (originalWorkspaceRoot) {
    process.env.WORKSPACE_ROOT = originalWorkspaceRoot;
  } else {
    delete process.env.WORKSPACE_ROOT;
  }
});

describe('IdentityModelAgent', () => {
  it('builds an initial profile', async () => {
    tempWorkspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'murmura-identity-'));
    process.env.WORKSPACE_ROOT = tempWorkspaceRoot;

    const model = await agent.buildInitial('user_test');
    expect(model.userId).toBe('user_test');
    expect(model.version).toBeGreaterThan(0);

    const soulPath = path.join(tempWorkspaceRoot, 'user_test', 'SOUL.md');
    const soulContent = await fs.readFile(soulPath, 'utf8');
    expect(soulContent).toContain('Style de Communication');
  });
});
