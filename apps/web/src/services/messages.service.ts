import { apiClient } from './api.client';

export type ApiThread = {
  id: string;
  userId: string;
  interlocuteurId: string;
  canal: string;
  subject?: string;
  archived: boolean;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
};

export type ApiMessage = {
  id: string;
  threadId: string;
  senderUserId: string;
  content: string;
  canal: string;
  replyToId?: string;
  attachments: Array<{ name: string; url: string }>;
  analysisJson?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
};

export async function getThreads() {
  return apiClient<ApiThread[]>('/threads');
}

export async function getMessages(threadId: string) {
  return apiClient<ApiMessage[]>(`/threads/${threadId}/messages`);
}

export async function createThread(payload: {
  interlocuteurId: string;
  canal?: 'email' | 'telegram' | 'whatsapp' | 'slack' | 'sms' | 'api' | 'internal';
  subject?: string;
}) {
  return apiClient<ApiThread>('/threads', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function sendMessage(threadId: string, payload: { content: string }) {
  return apiClient<{ message: ApiMessage; analysis: Record<string, unknown> }>(
    `/threads/${threadId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  );
}

export async function markAsRead(messageId: string) {
  return apiClient<ApiMessage>(`/messages/${messageId}/read`, {
    method: 'PATCH'
  });
}
