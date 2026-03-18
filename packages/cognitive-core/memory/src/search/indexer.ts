import { FileWatcher } from '../watcher/file.watcher.js';
import { MemorySearchEngine } from './search.engine.js';

export class MemoryIndexer {
  private watcher: FileWatcher | null = null;

  constructor(
    private readonly engine: MemorySearchEngine,
    watcher?: FileWatcher
  ) {
    if (watcher) {
      this.watcher = watcher;
    }
  }

  start(userId: string, workspacePath: string, onFileChange?: (filePath: string) => void) {
    if (!this.watcher) {
      this.watcher = new FileWatcher();
    }

    this.watcher.start(workspacePath, async (filePath) => {
      if (!filePath.endsWith('.md')) {
        return;
      }
      await this.engine.indexFile(
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

  stop() {
    this.watcher?.stop();
  }
}

