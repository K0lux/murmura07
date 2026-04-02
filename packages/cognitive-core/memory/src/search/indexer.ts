import { FileWatcher } from '../watcher/file.watcher.js';
import { MemorySearchEngine } from './search.engine.js';

export class MemoryIndexer {
  private readonly watchers = new Map<string, FileWatcher>();

  constructor(
    private readonly engine: MemorySearchEngine,
    private readonly testWatcher?: FileWatcher
  ) {}

  start(userId: string, workspacePath: string, onFileChange?: (filePath: string) => void) {
    if (this.watchers.has(userId)) {
      return;
    }

    const watcher = this.testWatcher ?? new FileWatcher();
    this.watchers.set(userId, watcher);

    watcher.start(workspacePath, async (filePath) => {
      if (!filePath.endsWith('.md')) {
        return;
      }

      await this.engine.indexFile(
        userId,
        workspacePath,
        filePath,
        filePath.includes('sessions') ? 'session' : 'memory'
      );

      if (onFileChange) {
        onFileChange(filePath);
      }
    });

    void this.engine.rebuildIndex(userId);
  }

  stop(userId?: string) {
    if (userId) {
      const watcher = this.watchers.get(userId);
      watcher?.stop();
      this.watchers.delete(userId);
      return;
    }

    for (const watcher of this.watchers.values()) {
      watcher.stop();
    }
    this.watchers.clear();
  }
}
