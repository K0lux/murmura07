export interface MurmuraResponse {
  requestId: string;
  data: unknown;
}

export interface ThreadResponse {
  id: string;
  interlocuteurId: string;
  canal: string;
  lastMessageAt?: string;
}

export interface MessageResponse {
  id: string;
  threadId: string;
  content: string;
  createdAt: string;
}

export interface RelationshipResponse {
  id: string;
  interlocuteurId: string;
  healthScore: number;
}

export interface MemorySearchResponse {
  results: Array<{
    snippet: string;
    source: string;
    score: number;
  }>;
}

export interface TwinSessionResponse {
  sessionId: string;
  relationshipContext: unknown;
}

export interface SlashCommandResponse {
  result: string;
  capabilityUsed: string;
  executionTimeMs: number;
}

export interface InternalThreadResponse {
  id: string;
  participantIds: string[];
  lastMessageAt?: string;
}

export interface InternalMessageResponse {
  id: string;
  threadId: string;
  senderId: string;
  contentEncrypted: string;
  createdAt: string;
}

export interface PresenceStatusResponse {
  userId: string;
  status: 'online' | 'away' | 'offline' | 'typing';
}
