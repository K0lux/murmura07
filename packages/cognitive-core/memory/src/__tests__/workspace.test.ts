import { describe, expect, it } from 'vitest';
import { WorkspaceManager } from '../workspace/workspace.manager.js';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

async function makeTempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'murmura-workspace-'));
  return dir;
}

describe('WorkspaceManager', () => {
  it('resolves a workspace path', () => {
    const wm = new WorkspaceManager('C:/murmura');
    expect(wm.resolveWorkspace('u1')).toContain('u1');
  });

  it('initializes workspace from template', async () => {
    const tempRoot = await makeTempDir();
    const templateDir = await makeTempDir();

    await fs.writeFile(path.join(templateDir, 'MEMORY.md'), '# Memory');
    await fs.mkdir(path.join(templateDir, 'memory'), { recursive: true });

    const wm = new WorkspaceManager(tempRoot, templateDir);
    const result = await wm.initWorkspace('user1');

    const memoryPath = path.join(result.workspacePath, 'MEMORY.md');
    const content = await fs.readFile(memoryPath, 'utf8');
    expect(content).toContain('Memory');
  });
});

