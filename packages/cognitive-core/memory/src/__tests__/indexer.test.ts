import { MemoryIndexer } from '../search/indexer.js';
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
  indexed: Array<{ workspace: string; filePath: string; source: string }> = [];
  rebuildCalled = false;
  rebuildUserId: string | null = null;

  async indexFile(workspace: string, filePath: string, source: string) {
    this.indexed.push({ workspace, filePath, source });
  }

  async rebuildIndex(userId: string) {
    this.rebuildCalled = true;
    this.rebuildUserId = userId;
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
    expect(engine.rebuildUserId).toBe('user1');
    expect(engine.indexed[0]?.filePath).toContain('MEMORY.md');
    expect(engine.indexed[0]?.source).toBe('memory');
  });

  it('indexes session files with session source classification', async () => {
    const engine = new FakeEngine();
    const watcher = new FakeWatcher();
    const indexer = new MemoryIndexer(engine as never, watcher as never);

    indexer.start('user1', 'C:/workspace');
    await new Promise((resolve) => setTimeout(resolve, 0));

    watcher.emit('C:/workspace/sessions/indexed/2026-03-18-thread.md');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(engine.indexed).toHaveLength(1);
    expect(engine.indexed[0]?.source).toBe('session');
  });

  it('ignores non-markdown files emitted by the watcher', async () => {
    const engine = new FakeEngine();
    const watcher = new FakeWatcher();
    const indexer = new MemoryIndexer(engine as never, watcher as never);

    indexer.start('user1', 'C:/workspace');
    await new Promise((resolve) => setTimeout(resolve, 0));

    watcher.emit('C:/workspace/cache.json');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(engine.indexed).toHaveLength(0);
  });

  it('forwards file change notifications to upstream listeners', async () => {
    const engine = new FakeEngine();
    const watcher = new FakeWatcher();
    const indexer = new MemoryIndexer(engine as never, watcher as never);
    const changedFiles: string[] = [];

    indexer.start('user1', 'C:/workspace', (filePath) => {
      changedFiles.push(filePath);
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    watcher.emit('C:/workspace/relationships/marc.md');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(changedFiles).toEqual(['C:/workspace/relationships/marc.md']);
  });
});

