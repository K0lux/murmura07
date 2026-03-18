import fs from 'node:fs/promises';
import path from 'node:path';
import { WorkspaceManager } from '../workspace/workspace.manager.js';

export class SessionLifecycle {
  constructor(private readonly workspaceManager = new WorkspaceManager()) {}

  async finalizeSession(userId: string, summary: string) {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const contextPath = path.join(workspacePath, 'CONTEXT.md');
    const content = `## Dernière Session\n${summary}\n`;
    await fs.writeFile(contextPath, content, 'utf8');
  }
}

