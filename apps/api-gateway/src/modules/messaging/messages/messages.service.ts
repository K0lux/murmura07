import { Injectable, NotFoundException } from '@nestjs/common';
import { CognitiveService } from '../../cognitive/cognitive.service.js';
import { ChannelsService } from '../../channels/channels.service.js';
import { WebsocketGateway } from '../../websocket/websocket.gateway.js';
import { MessagesRepository } from './messages.repository.js';
import { ThreadsService } from '../threads/threads.service.js';
import { SendMessageDto } from '../dto/send-message.dto.js';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly threadsService: ThreadsService,
    private readonly cognitiveService: CognitiveService,
    private readonly channelsService: ChannelsService,
    private readonly websocketGateway: WebsocketGateway
  ) {}

  async listMessages(userId: string, threadId: string, limit?: number) {
    await this.threadsService.getThread(threadId, userId);
    return this.messagesRepository.listByThread(threadId, limit);
  }

  async sendMessage(userId: string, threadId: string, dto: SendMessageDto) {
    const thread = await this.threadsService.getThread(threadId, userId);
    const analysis = await this.cognitiveService.analyze(`msg_${Date.now()}`, {
      userId,
      canal: thread.canal as 'email' | 'telegram' | 'whatsapp' | 'slack' | 'sms' | 'api' | 'internal',
      interlocuteurId: thread.interlocuteurId,
      content: dto.content,
      metadata: {
        timestamp: new Date(),
        threadId,
        urgencyFlag: false,
        attachments: dto.attachments ?? []
      }
    });

    const messagePayload: {
      threadId: string;
      senderUserId: string;
      content: string;
      canal: string;
      replyToId?: string;
      attachments: Array<{ name: string; url: string }>;
      analysisJson?: Record<string, unknown>;
    } = {
      threadId,
      senderUserId: userId,
      content: dto.content,
      canal: thread.canal,
      attachments: dto.attachments ?? [],
      analysisJson: analysis as unknown as Record<string, unknown>
    };

    if (dto.replyToId !== undefined) {
      messagePayload.replyToId = dto.replyToId;
    }

    const message = await this.messagesRepository.create(messagePayload);

    await this.threadsService.touchThread(threadId);
    await this.channelsService.sendMessage(thread.canal, thread.interlocuteurId, dto.content);
    this.websocketGateway.emitToUser(userId, 'message:new', { threadId, message });

    return { message, analysis };
  }

  async markRead(userId: string, messageId: string) {
    const message = await this.messagesRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.threadsService.getThread(message.threadId, userId);
    return this.messagesRepository.markRead(messageId);
  }
}
