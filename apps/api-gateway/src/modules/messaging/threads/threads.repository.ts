import { Injectable } from '@nestjs/common';

export interface ThreadRecord {
  id: string;
  userId: string;
  interlocuteurId: string;
  canal: string;
  subject?: string;
  archived: boolean;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

@Injectable()
export class ThreadsRepository {
  private readonly threads = new Map<string, ThreadRecord>();

  async create(data: Omit<ThreadRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    const thread: ThreadRecord = {
      id: `thread_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
      ...data
    };
    this.threads.set(thread.id, thread);
    return thread;
  }

  async listByUser(userId: string) {
    return [...this.threads.values()]
      .filter((thread) => thread.userId === userId)
      .sort((a, b) => (b.lastMessageAt?.getTime() ?? b.updatedAt.getTime()) - (a.lastMessageAt?.getTime() ?? a.updatedAt.getTime()));
  }

  async findById(id: string) {
    return this.threads.get(id) ?? null;
  }

  async update(id: string, patch: Partial<ThreadRecord>) {
    const current = this.threads.get(id);
    if (!current) {
      return null;
    }

    const updated: ThreadRecord = {
      ...current,
      ...patch,
      updatedAt: new Date()
    };
    this.threads.set(id, updated);
    return updated;
  }

  async delete(id: string) {
    return this.threads.delete(id);
  }
}
