import { describe, expect, it } from 'vitest';
import { MemorySearchEngine } from '../search/search.engine.js';
import { WorkspaceManager } from '../workspace/workspace.manager.js';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

async function makeTempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'murmura-search-'));
  return dir;
}

describe('MemorySearchEngine', () => {
  it('returns matches for query', async () => {
    const tempRoot = await makeTempDir();
    const templateDir = await makeTempDir();

    await fs.writeFile(path.join(templateDir, 'MEMORY.md'), 'Project Alpha discussion');
    await fs.writeFile(path.join(templateDir, 'CONTEXT.md'), 'Current priorities include Project Alpha.');
    await fs.mkdir(path.join(templateDir, 'memory'), { recursive: true });
    await fs.mkdir(path.join(templateDir, 'relationships'), { recursive: true });
    await fs.mkdir(path.join(templateDir, 'sessions', 'indexed'), { recursive: true });

    const workspaceManager = new WorkspaceManager(tempRoot, templateDir);
    await workspaceManager.initWorkspace('user1');

    const engine = new MemorySearchEngine(workspaceManager);
    const results = await engine.search('user1', 'alpha');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].snippet.toLowerCase()).toContain('alpha');
  });
});

