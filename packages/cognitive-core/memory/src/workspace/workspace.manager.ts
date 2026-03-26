import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

export interface WorkspaceInitResult {
  workspacePath: string;
  created: boolean;
}

const resolveTemplateDir = () => {
  const candidates = [
    path.resolve(process.cwd(), 'workspace-template'),
    path.resolve(process.cwd(), '..', 'workspace-template'),
    path.resolve(process.cwd(), '..', '..', 'workspace-template'),
    path.resolve(process.cwd(), '..', '..', '..', 'workspace-template')
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), 'workspace-template');
};

export class WorkspaceManager {
  constructor(
    private readonly baseDir = process.env['MURMURA_WORKSPACE_DIR'],
    private readonly templateDir = resolveTemplateDir()
  ) {}

  resolveWorkspace(userId: string): string {
    const root = this.baseDir ?? path.join(process.env['HOME'] ?? '.', '.murmura', 'workspace');
    return path.join(root, userId);
  }

  async initWorkspace(userId: string): Promise<WorkspaceInitResult> {
    const workspacePath = this.resolveWorkspace(userId);
    if (existsSync(workspacePath)) {
      return { workspacePath, created: false };
    }

    await fs.mkdir(workspacePath, { recursive: true });
    await this.copyTemplate(workspacePath);

    return { workspacePath, created: true };
  }

  async ensureWorkspace(userId: string): Promise<string> {
    const { workspacePath } = await this.initWorkspace(userId);
    return workspacePath;
  }

  private async copyTemplate(destination: string) {
    const entries = await fs.readdir(this.templateDir, { withFileTypes: true });
    for (const entry of entries) {
      const src = path.join(this.templateDir, entry.name);
      const dest = path.join(destination, entry.name);
      if (entry.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        await this.copyDirectory(src, dest);
      } else if (entry.isFile()) {
        await fs.copyFile(src, dest);
      }
    }
  }

  private async copyDirectory(src: string, dest: string) {
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const entrySrc = path.join(src, entry.name);
      const entryDest = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await fs.mkdir(entryDest, { recursive: true });
        await this.copyDirectory(entrySrc, entryDest);
      } else if (entry.isFile()) {
        await fs.copyFile(entrySrc, entryDest);
      }
    }
  }
}
