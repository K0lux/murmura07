import fs from 'node:fs/promises';
import path from 'node:path';
import { WorkspaceManager } from '../workspace/workspace.manager.js';

export interface SessionRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
}

export class SessionStore {
  constructor(private readonly workspaceManager = new WorkspaceManager()) {}

  async append(userId: string, sessionId: string, entry: Record<string, unknown>) {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const sessionsDir = path.join(workspacePath, 'sessions');
    await fs.mkdir(sessionsDir, { recursive: true });

    const filePath = path.join(sessionsDir, `${sessionId}.jsonl`);
    await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, 'utf8');
  }

  async listSessions(userId: string): Promise<SessionRecord[]> {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const indexPath = path.join(workspacePath, 'sessions', 'sessions.json');

    try {
      const content = await fs.readFile(indexPath, 'utf8');
      return JSON.parse(content) as SessionRecord[];
    } catch {
      return [];
    }
  }
}

