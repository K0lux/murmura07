import { Injectable, NotFoundException } from '@nestjs/common';
import { ThreadsRepository } from './threads.repository.js';
import { CreateThreadDto } from '../dto/create-thread.dto.js';

@Injectable()
export class ThreadsService {
  constructor(private readonly threadsRepository: ThreadsRepository) {}

  async listThreads(userId: string) {
    return this.threadsRepository.listByUser(userId);
  }

  async createThread(userId: string, dto: CreateThreadDto) {
    const canal = dto.canal ?? 'internal';

    const payload: {
      userId: string;
      interlocuteurId: string;
      canal: string;
      subject?: string;
      archived: boolean;
      pinned: boolean;
      lastMessageAt?: Date;
    } = {
      userId,
      interlocuteurId: dto.interlocuteurId,
      canal,
      archived: false,
      pinned: false
    };

    if (dto.subject !== undefined) {
      payload.subject = dto.subject;
    }

    return this.threadsRepository.create(payload);
  }

  async getThread(threadId: string, userId: string) {
    const thread = await this.threadsRepository.findById(threadId);
    if (!thread || thread.userId !== userId) {
      throw new NotFoundException('Thread not found');
    }
    return thread;
  }

  async updateThread(threadId: string, userId: string, patch: { archived?: boolean; pinned?: boolean }) {
    await this.getThread(threadId, userId);
    return this.threadsRepository.update(threadId, patch);
  }

  async deleteThread(threadId: string, userId: string) {
    await this.getThread(threadId, userId);
    await this.threadsRepository.delete(threadId);
    return { deleted: true };
  }

  async touchThread(threadId: string) {
    return this.threadsRepository.update(threadId, { lastMessageAt: new Date() });
  }
}
