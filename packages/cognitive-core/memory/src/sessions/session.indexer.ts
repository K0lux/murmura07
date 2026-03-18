import fs from 'node:fs/promises';
import path from 'node:path';
import { WorkspaceManager } from '../workspace/workspace.manager.js';

export class SessionIndexer {
  constructor(private readonly workspaceManager = new WorkspaceManager()) {}

  async exportSession(userId: string, sessionId: string) {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const sessionPath = path.join(workspacePath, 'sessions', `${sessionId}.jsonl`);
    const indexedDir = path.join(workspacePath, 'sessions', 'indexed');

    await fs.mkdir(indexedDir, { recursive: true });

    const content = await fs.readFile(sessionPath, 'utf8');
    const lines = content
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        try {
          const entry = JSON.parse(line) as { content?: string };
          return entry.content ?? line;
        } catch {
          return line;
        }
      });

    const markdown = lines.map((line) => `- ${line}`).join('\n');
    const target = path.join(indexedDir, `${sessionId}.md`);
    await fs.writeFile(target, markdown, 'utf8');
  }
}

