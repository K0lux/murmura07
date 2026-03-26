import { Injectable } from '@nestjs/common';

interface TwinSessionMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface TwinSession {
  sessionId: string;
  userId: string;
  contactId: string;
  relationshipContext: Record<string, unknown>;
  messages: TwinSessionMessage[];
  updatedAt: string;
}

@Injectable()
export class DigitalTwinSessionStore {
  private readonly sessions = new Map<string, TwinSession>();

  async createSession(userId: string, contactId: string, relationshipContext: Record<string, unknown>) {
    const sessionId = `twin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const session: TwinSession = {
      sessionId,
      userId,
      contactId,
      relationshipContext,
      messages: [],
      updatedAt: new Date().toISOString()
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string) {
    return this.sessions.get(sessionId) ?? null;
  }

  async appendMessage(sessionId: string, message: TwinSessionMessage) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    session.messages.push(message);
    session.updatedAt = new Date().toISOString();
    this.sessions.set(sessionId, session);
    return session;
  }

  async closeSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
