import { MemoryIndexer } from '../indexer.js';
import { describe, expect, it } from 'vitest';

class FakeWatcher {
  private callback: ((filePath: string) => void) | null = null;

  start(_root: string, cb: (filePath: string) => void) {
    this.callback = cb;
  }

  emit(filePath: string) {
    this.callback?.(filePath);
  }

  stop() {
    return;
  }
}

class FakeEngine {
  indexed: string[] = [];
  rebuildCalled = false;

  async indexFile(_workspace: string, filePath: string) {
    this.indexed.push(filePath);
  }

  async rebuildIndex() {
    this.rebuildCalled = true;
  }
}

describe('MemoryIndexer', () => {
  it('calls rebuild and index on file change', async () => {
    const engine = new FakeEngine();
    const watcher = new FakeWatcher();
    const indexer = new MemoryIndexer(engine as never, watcher as never);

    indexer.start('user1', 'C:/workspace');
    await new Promise((resolve) => setTimeout(resolve, 0));

    watcher.emit('C:/workspace/MEMORY.md');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(engine.rebuildCalled).toBe(true);
    expect(engine.indexed[0]).toContain('MEMORY.md');
  });
});

