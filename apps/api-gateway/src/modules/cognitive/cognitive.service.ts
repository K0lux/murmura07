import { Injectable } from '@nestjs/common';
import {
  MurmuraResponseSchema,
  MessageAnalysisSchema,
  Recommendation,
  Alert,
  RawMessage,
  ConversationContext,
  IdentityModel,
  RelationshipNode,
  AutonomyConfig
} from '@murmura/cognitive-core-shared';
import { IngestionPipeline } from '@murmura/cognitive-core-ingestion';
import {
  MemorySearchEngine,
  WorkspaceManager,
  MemoryIndexer
} from '@murmura/cognitive-core-memory';
import { ContextEngine } from '@murmura/cognitive-core-context-engine';
import { PipelineOrchestrator } from './orchestrator/pipeline.orchestrator.js';
import path from 'node:path';
import fs from 'node:fs/promises';

@Injectable()
export class CognitiveService {
  private readonly ingestion = new IngestionPipeline();
  private readonly memorySearch = new MemorySearchEngine();
  private readonly workspaceManager = new WorkspaceManager();
  private readonly contextEngine = new ContextEngine();
  private readonly orchestrator = new PipelineOrchestrator();
  private readonly indexer = new MemoryIndexer(this.memorySearch);
  private indexedUsers = new Set<string>();

  private identityStore = new Map<string, IdentityModel>();
  private relationshipStore = new Map<string, RelationshipNode[]>();

  async analyze(requestId: string, message: RawMessage) {
    this.ensureIndexing(message.userId);

    const analysis = await this.ingestion.process(message);

    const recommendation: Recommendation = {
      strategy: analysis.tensionScore > 0.6 ? 'respond_diplomatic' : 'respond_direct',
      rationale: analysis.tensionScore > 0.6 ? 'Préserver la relation sous tension.' : 'Réponse directe suffisante.',
      confidence: 0.6
    };

    const alerts: Alert[] = [];
    if (analysis.tensionScore > 0.7) {
      alerts.push({
        type: 'high_tension',
        severity: 'warning',
        message: 'Tension élevée détectée.',
        triggeredBy: 'tensionScore'
      });
    }

    const decision = await this.orchestrator.run({
      userId: message.userId,
      requestId,
      analysis,
      recommendation,
      simulations: [],
      alerts,
      autonomyConfig: this.defaultAutonomyConfig(message.userId)
    });

    const response = {
      requestId,
      analysis: MessageAnalysisSchema.parse(analysis),
      recommendation: {
        ...recommendation,
        suggestedReply: decision.suggestedReply
      },
      simulations: [],
      alerts,
      autonomyAllowed: decision.autonomyAllowed
    };

    return MurmuraResponseSchema.parse(response);
  }

  async searchMemory(
    userId: string,
    query: string,
    options: { limit?: number; sources?: string[] }
  ) {
    this.ensureIndexing(userId);
    const searchOptions: { limit?: number; sources?: Array<'memory' | 'session'> } = {};
    if (options.limit !== undefined) {
      searchOptions.limit = options.limit;
    }
    if (options.sources !== undefined) {
      searchOptions.sources = options.sources as Array<'memory' | 'session'>;
    }
    return this.memorySearch.search(userId, query, searchOptions);
  }

  async getMemoryFile(userId: string, relativePath: string, startLine = 1, numLines = 20) {
    const workspacePath = await this.workspaceManager.ensureWorkspace(userId);
    const resolved = path.resolve(workspacePath, relativePath);

    if (!resolved.startsWith(path.resolve(workspacePath))) {
      throw new Error('Invalid path');
    }

    const content = await fs.readFile(resolved, 'utf8');
    const lines = content.split(/\r?\n/);
    const startIndex = Math.max(0, startLine - 1);
    const endIndex = Math.min(lines.length, startIndex + numLines);

    return {
      path: relativePath,
      startLine: startIndex + 1,
      lines: lines.slice(startIndex, endIndex)
    };
  }

  async getIdentity(userId: string): Promise<IdentityModel> {
    const existing = this.identityStore.get(userId);
    if (existing) {
      return existing;
    }

    const identity: IdentityModel = {
      userId,
      communicationStyle: { formality: 'medium', tone: 'neutral' },
      confrontationLevel: 0.3,
      riskTolerance: 0.4,
      recurringBiases: [],
      typicalMistakes: [],
      longTermObjectives: [],
      coreValues: ['clarity'],
      updatedAt: new Date(),
      version: 1
    };

    this.identityStore.set(userId, identity);
    return identity;
  }

  async updateIdentity(userId: string, patch: Partial<IdentityModel>) {
    const current = await this.getIdentity(userId);
    const updated = {
      ...current,
      ...patch,
      communicationStyle: {
        ...current.communicationStyle,
        ...(patch.communicationStyle ?? {})
      },
      updatedAt: new Date(),
      version: current.version + 1
    } as IdentityModel;

    this.identityStore.set(userId, updated);
    return updated;
  }

  async getRelationships(userId: string, _query: { type?: string; sort?: string }) {
    return this.relationshipStore.get(userId) ?? [];
  }

  async getRelationshipDetail(userId: string, interlocuteurId: string) {
    const relationships = this.relationshipStore.get(userId) ?? [];
    return relationships.find((rel) => rel.interlocuteurId === interlocuteurId) ?? null;
  }

  async updateRelationshipNotes(_userId: string, _id: string, notes: string) {
    return { notesUpdated: true, notesLength: notes.length };
  }

  async getGovernanceRules(_userId: string) {
    return [];
  }

  async createGovernanceRule(_userId: string, description: string) {
    return { id: `rule_${Date.now()}`, description, isActive: true };
  }

  async getContext(userId: string, threadId: string): Promise<ConversationContext> {
    return this.contextEngine.buildContext(userId, threadId);
  }

  private defaultAutonomyConfig(userId: string): AutonomyConfig {
    return {
      userId,
      defaultLevel: 'suggestion_only',
      rules: []
    };
  }

  private ensureIndexing(userId: string) {
    if (this.indexedUsers.has(userId)) {
      return;
    }

    void this.workspaceManager.ensureWorkspace(userId).then((workspacePath) => {
      this.indexer.start(userId, workspacePath, () => {
        this.contextEngine.notifyWorkspaceChanged(userId);
      });
      this.indexedUsers.add(userId);
    });
  }
}

