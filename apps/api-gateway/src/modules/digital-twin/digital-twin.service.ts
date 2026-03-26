import { Injectable, NotFoundException } from '@nestjs/common';
import { CognitiveService } from '../cognitive/cognitive.service.js';
import { OpenClawService } from '../openclaw/openclaw.service.js';
import { DigitalTwinSessionStore } from './digital-twin.session-store.js';
import { DigitalTwinOrchestrator } from './digital-twin.orchestrator.js';
import { DigitalTwinStreamService } from './digital-twin.stream-service.js';

@Injectable()
export class DigitalTwinService {
  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly openClawService: OpenClawService,
    private readonly sessionStore: DigitalTwinSessionStore,
    private readonly orchestrator: DigitalTwinOrchestrator,
    private readonly streamService: DigitalTwinStreamService
  ) {}

  async createSession(userId: string, contactId: string) {
    const relationshipContext = await this.getRelationshipContext(userId, contactId);
    const session = await this.sessionStore.createSession(userId, contactId, relationshipContext);

    return {
      sessionId: session.sessionId,
      relationshipContext,
      suggestedChips: [
        'Comment répondre à son dernier message ?',
        'Résume la relation',
        'Y a-t-il des tensions non résolues ?'
      ]
    };
  }

  async sendMessage(userId: string, sessionId: string, content: string) {
    const session = await this.sessionStore.getSession(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Twin session not found');
    }

    await this.sessionStore.appendMessage(sessionId, {
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    });

    const memory = await this.cognitiveService.searchMemory(userId, content, { limit: 3 });
    const toolResult = await this.orchestrator.searchMemory(userId, content);
    const response = [
      `Contexte chargé pour ${session.contactId}.`,
      `Mémoire pertinente: ${memory.length} éléments.`,
      `Recherche interne: ${toolResult.count} résultats.`,
      `Je te suggère de répondre avec calme et précision.`
    ].join(' ');

    await this.sessionStore.appendMessage(sessionId, {
      role: 'assistant',
      content: response,
      createdAt: new Date().toISOString()
    });

    this.streamService.setBufferedResponse(sessionId, response);
    return {
      streamUrl: `/v1/twin/stream/${sessionId}`,
      capabilityUsed: 'memory'
    };
  }

  openStream(sessionId: string) {
    return this.streamService.openStream(sessionId);
  }

  async getRelationshipContext(userId: string, contactId: string) {
    const relationships = await this.cognitiveService.getRelationships(userId, {});
    const relationship = relationships.find((item) => item.interlocuteurId === contactId) ?? null;

    return {
      contactId,
      healthScore: relationship?.healthScore ?? 0.5,
      trustLevel: relationship?.trustLevel ?? 0.5,
      summary: relationship ? 'Relationship context loaded from cognitive store' : 'No detailed relationship notes yet'
    };
  }

  async closeSession(userId: string, sessionId: string) {
    const session = await this.sessionStore.getSession(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundException('Twin session not found');
    }

    await this.sessionStore.closeSession(sessionId);
    this.streamService.closeStream(sessionId);
    return { sessionId, closed: true };
  }
}
