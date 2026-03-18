export interface MurmuraAnalyzeRequest {
  content: string;
  canal: string;
  interlocuteurId: string;
  threadId?: string;
  urgencyFlag?: boolean;
}

export interface MemorySearchRequest {
  query: string;
  limit?: number;
}

export interface SendMessageRequest {
  content: string;
  attachments?: unknown[];
  replyToId?: string;
}

export interface CreateThreadRequest {
  interlocuteurId: string;
  canal: string;
  subject?: string;
}
