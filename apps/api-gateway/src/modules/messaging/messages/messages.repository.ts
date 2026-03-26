import { Injectable } from '@nestjs/common';

export interface MessageRecord {
  id: string;
  threadId: string;
  senderUserId: string;
  content: string;
  canal: string;
  replyToId?: string;
  attachments: Array<{ name: string; url: string }>;
  analysisJson?: Record<string, unknown>;
  createdAt: Date;
  readAt?: Date;
}

@Injectable()
export class MessagesRepository {
  private readonly messages = new Map<string, MessageRecord>();

  async create(data: Omit<MessageRecord, 'id' | 'createdAt'>) {
    const message: MessageRecord = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      ...data
    };
    this.messages.set(message.id, message);
    return message;
  }

  async listByThread(threadId: string, limit = 20) {
    return [...this.messages.values()]
      .filter((message) => message.threadId === threadId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-limit);
  }

  async findById(id: string) {
    return this.messages.get(id) ?? null;
  }

  async markRead(id: string) {
    const current = this.messages.get(id);
    if (!current) {
      return null;
    }

    const updated: MessageRecord = {
      ...current,
      readAt: new Date()
    };
    this.messages.set(id, updated);
    return updated;
  }
}
