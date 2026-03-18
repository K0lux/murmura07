import fs from 'node:fs/promises';
import path from 'node:path';
import { WorkspaceManager } from '../workspace/workspace.manager.js';

export class MemoryFlusher {
  constructor(private readonly workspaceManager = new WorkspaceManager()) {}

  async flush(userId: string, note: string) {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const memoryDir = path.join(workspacePath, 'memory');
    await fs.mkdir(memoryDir, { recursive: true });

    const today = new Date().toISOString().slice(0, 10);
    const filePath = path.join(memoryDir, `${today}.md`);
    await fs.appendFile(filePath, `\n- ${note}\n`, 'utf8');
  }
}

