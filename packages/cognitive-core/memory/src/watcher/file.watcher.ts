import fs from 'node:fs';
import path from 'node:path';

export type FileWatchCallback = (filePath: string) => void;

export class FileWatcher {
  private watcher: fs.FSWatcher | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;

  start(rootDir: string, onChange: FileWatchCallback, debounceMs = 300) {
    if (this.watcher) {
      return;
    }

    const safeRoot = path.resolve(rootDir);

    this.watcher = fs.watch(safeRoot, { recursive: true }, (_event, filename) => {
      if (!filename) {
        return;
      }
      if (filename.startsWith('.') || filename.includes('node_modules')) {
        return;
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        const fullPath = path.join(safeRoot, filename.toString());
        onChange(fullPath);
      }, debounceMs);
    });
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
