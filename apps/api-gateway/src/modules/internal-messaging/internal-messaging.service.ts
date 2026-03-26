import { Injectable } from '@nestjs/common';
import { CognitiveService } from '../cognitive/cognitive.service.js';
import { WebsocketGateway } from '../websocket/websocket.gateway.js';
import { SendInternalMessageDto } from './dto/send-internal-message.dto.js';

@Injectable()
export class InternalMessagingService {
  private readonly threads = new Map<string, { id: string; targetUserId: string }>();
  private readonly messages = new Map<string, Array<Record<string, unknown>>>();

  constructor(
    private readonly cognitiveService: CognitiveService,
    private readonly websocketGateway: WebsocketGateway
  ) {}

  listThreads() {
    return { threads: [...this.threads.values()] };
  }

  createThread(targetUserId: string) {
    const thread = {
      id: `internal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      targetUserId
    };
    this.threads.set(thread.id, thread);
    this.messages.set(thread.id, []);
    return thread;
  }

  listMessages(threadId: string) {
    return { threadId, messages: this.messages.get(threadId) ?? [] };
  }

  async sendMessage(threadId: string, body: SendInternalMessageDto) {
    const message = {
      id: `intmsg_${Date.now()}`,
      threadId,
      content: body.content,
      contentEncrypted: body.contentEncrypted ?? null,
      replyToId: body.replyToId ?? null,
      createdAt: new Date().toISOString()
    };

    const threadMessages = this.messages.get(threadId) ?? [];
    threadMessages.push(message);
    this.messages.set(threadId, threadMessages);

    const analysis = await this.cognitiveService.analyze(`internal_${Date.now()}`, {
      userId: 'internal-user',
      canal: 'api',
      interlocuteurId: threadId,
      content: body.content,
      metadata: {
        timestamp: new Date(),
        threadId,
        urgencyFlag: false,
        attachments: []
      }
    });

    this.websocketGateway.emitToUser(threadId, 'internal:message:new', { message, analysis });
    return { message, analysis };
  }

  react(messageId: string, emoji: string) {
    return { messageId, emoji, toggled: true };
  }

  searchUsers(query: string) {
    return {
      query,
      users: query
        ? [
            {
              id: `user_${query.toLowerCase()}`,
              displayName: `Result for ${query}`,
              email: `${query.toLowerCase()}@murmura.local`
            }
          ]
        : []
    };
  }
}
