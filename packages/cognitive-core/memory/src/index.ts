import { WorkspaceManager } from './workspace/workspace.manager.js';
import { WorkspaceInitializer } from './workspace/workspace.initializer.js';
import { WorkspaceValidator } from './workspace/workspace.validator.js';
import { FileLocker } from './workspace/file.locker.js';
import { FileWatcher } from './watcher/file.watcher.js';
import { MemorySearchEngine } from './search/search.engine.js';
import { MemoryIndexer } from './search/indexer.js';
import { VectorIndex } from './search/vector.index.js';
import { Bm25Index } from './search/bm25.index.js';
import { EmbeddingCache } from './search/embedding.cache.js';
import { OpenAIProvider } from './embeddings/openai.provider.js';
import { SessionStore } from './sessions/session.store.js';
import { SessionLifecycle } from './sessions/session.lifecycle.js';
import { SessionIndexer } from './sessions/session.indexer.js';
import { SessionScoping } from './sessions/session.scoping.js';
import { TokenEstimator } from './compaction/token.estimator.js';
import { CompactionTrigger } from './compaction/compaction.trigger.js';
import { MemoryFlusher } from './compaction/memory.flusher.js';
import { SessionCompactor } from './compaction/session.compactor.js';
import { BudgetManager } from './context/budget.manager.js';
import { ContextInjector } from './context/context.injector.js';
import { ContextDetector } from './context/context.detector.js';
import { SearchInjector } from './context/search.injector.js';
import { EpisodicMemory } from './episodic/episodic.memory.js';
import { EpisodeScorer } from './episodic/episode.scorer.js';
import { EpisodeCompressor } from './episodic/episode.compressor.js';
import { SqliteManager } from './db/sqlite.manager.js';

export {
  WorkspaceManager,
  WorkspaceInitializer,
  WorkspaceValidator,
  FileLocker,
  FileWatcher,
  MemorySearchEngine,
  MemoryIndexer,
  VectorIndex,
  Bm25Index,
  EmbeddingCache,
  OpenAIProvider,
  SessionStore,
  SessionLifecycle,
  SessionIndexer,
  SessionScoping,
  TokenEstimator,
  CompactionTrigger,
  MemoryFlusher,
  SessionCompactor,
  BudgetManager,
  ContextInjector,
  ContextDetector,
  SearchInjector,
  EpisodicMemory,
  EpisodeScorer,
  EpisodeCompressor,
  SqliteManager
};

