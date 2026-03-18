import fs from 'node:fs/promises';
import path from 'node:path';
import { MemorySearchResult } from '@murmura/cognitive-core-shared';
import { WorkspaceManager } from '../workspace/workspace.manager.js';
import { Chunk, chunkMarkdown } from './chunker.js';
import { createIndexState, hashContent } from './index.state.js';
import { mergeHybridScores } from './hybrid.merger.js';
import { selectEmbeddingProvider } from '../embeddings/provider.selector.js';

interface DocumentIndex {
  chunk: Chunk;
  sourceType: 'memory' | 'session';
  content: string;
  tokens: string[];
  termFreq: Map<string, number>;
  embedding: number[];
}

interface SearchOptions {
  limit?: number;
  sources?: Array<'memory' | 'session'>;
}

export class MemorySearchEngine {
  private index: DocumentIndex[] = [];
  private docFreq = new Map<string, number>();
  private totalDocs = 0;
  private fileChunks = new Map<string, Chunk[]>();
  private indexState = createIndexState();
  private embeddingProvider = selectEmbeddingProvider();

  constructor(private readonly workspaceManager = new WorkspaceManager()) {}

  async rebuildIndex(userId: string): Promise<void> {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const files = await this.collectFiles(workspacePath);

    for (const file of files) {
      await this.indexFile(workspacePath, file.filePath, file.sourceType);
    }

    this.rebuildScores();
    this.indexState.lastIndexedAt = new Date();
  }

  async indexFile(workspacePath: string, filePath: string, sourceType: 'memory' | 'session') {
    const content = await fs.readFile(filePath, 'utf8');
    const contentHash = hashContent(content);
    const previousHash = this.indexState.fileHashes.get(filePath);

    if (previousHash && previousHash === contentHash) {
      return;
    }

    const chunks = chunkMarkdown(filePath, content);
    this.fileChunks.set(filePath, chunks);
    this.indexState.fileHashes.set(filePath, contentHash);

    const embeddings = await this.embeddingProvider.embedBatch(chunks.map((chunk) => chunk.content));

    const chunkEntries: DocumentIndex[] = chunks.map((chunk, index) => {
      const tokens = this.tokenize(chunk.content);
      return {
        chunk,
        sourceType,
        content: chunk.content,
        tokens,
        termFreq: this.buildTermFreq(tokens),
        embedding: embeddings[index] ?? []
      };
    });

    this.index = this.index.filter((entry) => entry.chunk.filePath !== filePath).concat(chunkEntries);
  }

  async search(userId: string, query: string, options: SearchOptions = {}): Promise<MemorySearchResult[]> {
    if (!this.index.length) {
      await this.rebuildIndex(userId);
    }

    const tokens = this.tokenize(query);
    if (!tokens.length) {
      return [];
    }

    const vector = await this.embeddingProvider.embed(query);

    const scores = this.index
      .filter((entry) => (options.sources ? options.sources.includes(entry.sourceType) : true))
      .map((entry) => {
        const bm25Score = this.bm25Score(entry, tokens);
        const vectorScore = this.cosineSimilarity(vector, entry.embedding);
        return { chunk: entry.chunk, bm25Score, vectorScore, combinedScore: 0 };
      });

    const merged = mergeHybridScores(scores, { bm25: 0.7, vector: 0.3 })
      .filter((score) => score.combinedScore > 0)
      .slice(0, options.limit ?? 6);

    return merged.map((score) => this.toResult(score.chunk, query, score.combinedScore, score.chunk.filePath));
  }

  private rebuildScores() {
    this.totalDocs = this.index.length;
    this.docFreq = new Map();
    for (const entry of this.index) {
      for (const token of new Set(entry.tokens)) {
        this.docFreq.set(token, (this.docFreq.get(token) ?? 0) + 1);
      }
    }
  }

  private async collectFiles(workspacePath: string) {
    const candidates: Array<{ filePath: string; sourceType: 'memory' | 'session' }> = [];
    const memoryPath = path.join(workspacePath, 'MEMORY.md');
    const contextPath = path.join(workspacePath, 'CONTEXT.md');

    candidates.push({ filePath: memoryPath, sourceType: 'memory' });
    candidates.push({ filePath: contextPath, sourceType: 'memory' });

    await this.collectMarkdown(path.join(workspacePath, 'memory'), candidates, 'memory');
    await this.collectMarkdown(path.join(workspacePath, 'relationships'), candidates, 'memory');
    await this.collectMarkdown(path.join(workspacePath, 'sessions', 'indexed'), candidates, 'session');

    return candidates;
  }

  private async collectMarkdown(
    dirPath: string,
    candidates: Array<{ filePath: string; sourceType: 'memory' | 'session' }>,
    sourceType: 'memory' | 'session'
  ) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          await this.collectMarkdown(fullPath, candidates, sourceType);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          candidates.push({ filePath: fullPath, sourceType });
        }
      }
    } catch {
      return;
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .map((token) => token.trim())
      .filter((token) => token.length > 2);
  }

  private buildTermFreq(tokens: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    for (const token of tokens) {
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }
    return freq;
  }

  private bm25Score(entry: DocumentIndex, queryTokens: string[]): number {
    const k1 = 1.5;
    const b = 0.75;
    const avgDocLen = this.index.reduce((sum, d) => sum + d.tokens.length, 0) / Math.max(1, this.totalDocs);
    const docLen = entry.tokens.length || 1;

    let score = 0;
    for (const token of queryTokens) {
      const tf = entry.termFreq.get(token) ?? 0;
      if (!tf) {
        continue;
      }
      const df = this.docFreq.get(token) ?? 0;
      const idf = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));
      const denom = tf + k1 * (1 - b + b * (docLen / avgDocLen));
      score += idf * ((tf * (k1 + 1)) / denom);
    }

    return score;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (!a.length || !b.length || a.length !== b.length) {
      return 0;
    }
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i += 1) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) {
      return 0;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private toResult(chunk: Chunk, query: string, score: number, sourcePath: string): MemorySearchResult {
    const snippetInfo = this.extractSnippet(chunk.content, query);
    return {
      snippet: snippetInfo.snippet,
      source: sourcePath,
      lineRange: [chunk.startLine, chunk.endLine],
      score,
      sourceType: sourcePath.includes('sessions') ? 'session' : 'memory'
    };
  }

  private extractSnippet(content: string, query: string): { snippet: string } {
    const lower = content.toLowerCase();
    const token = query.toLowerCase().split(/\s+/)[0] ?? '';
    const index = token ? lower.indexOf(token) : -1;
    if (index === -1) {
      return { snippet: content.slice(0, 200) };
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 150);
    return { snippet: content.slice(start, end) };
  }
}

