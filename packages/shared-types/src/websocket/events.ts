export type CapabilityType = 'cognitive' | 'memory' | 'web' | 'calendar';

// Digital Twin events
export interface TwinStreamChunk {
  sessionId: string;
  chunk: string;
  messageId: string;
}

export interface TwinStreamDone {
  sessionId: string;
  messageId: string;
}

export interface TwinCapabilityUsed {
  sessionId: string;
  capability: CapabilityType;
}

export interface TwinToolStarted {
  sessionId: string;
  tool: string;
}

export interface TwinToolResult {
  sessionId: string;
  tool: string;
  summary: string;
}

// Slash command events
export interface SlashProcessing {
  commandId: string;
  command: string;
}

export interface SlashResult {
  commandId: string;
  result: string;
  capabilityUsed: CapabilityType | string;
}

export interface SlashError {
  commandId: string;
  error: string;
}

// Internal messaging events
export interface InternalMessageNew {
  threadId: string;
  messageId: string;
}

export interface InternalMessageDelivered {
  messageId: string;
  deliveredAt: string;
}

export interface InternalMessageRead {
  messageId: string;
  readAt: string;
}

export interface InternalTypingStart {
  threadId: string;
  userId: string;
}

export interface InternalTypingStop {
  threadId: string;
  userId: string;
}

export interface InternalPresenceUpdate {
  userId: string;
  status: 'online' | 'away' | 'offline' | 'typing';
}

export interface InternalReactionNew {
  messageId: string;
  emoji: string;
  userId: string;
  count: number;
}

export interface InternalReactionRemoved {
  messageId: string;
  emoji: string;
  userId: string;
  count: number;
}

export interface InternalAnalysisReady {
  threadId: string;
  messageId: string;
  analysis: unknown;
}

export interface InternalDraftScore {
  threadId: string;
  tensionScore: number;
}
