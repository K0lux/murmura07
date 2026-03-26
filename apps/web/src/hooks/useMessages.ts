import { useEffect, useMemo, useState } from 'react';
import { type ApiMessage, type ApiThread, getMessages, getThreads } from '../services/messages.service';
import { useAuth } from './useAuth';
import { useRoute } from '../utils/router';
import type { ApiAnalysis, StoredCognitivePayload } from '../services/analyze.service';

export const messagesRefreshEvent = 'murmura:messages:refresh';

export function notifyMessagesRefresh() {
  window.dispatchEvent(new Event(messagesRefreshEvent));
}

function parseCognitivePayload(value: ApiMessage['analysisJson']): StoredCognitivePayload | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if (!('analysis' in value) || typeof value.analysis !== 'object') {
    return null;
  }

  const payload = value as Partial<StoredCognitivePayload>;
  const maybeAnalysis = payload.analysis as Partial<ApiAnalysis>;
  if (
    typeof maybeAnalysis.intention !== 'string' ||
    typeof maybeAnalysis.tensionScore !== 'number' ||
    !maybeAnalysis.emotion ||
    typeof maybeAnalysis.emotion.dominant !== 'string'
  ) {
    return null;
  }

  return payload as StoredCognitivePayload;
}

function mapThread(thread: ApiThread, relatedMessages: ApiMessage[]) {
  const latestMessage = [...relatedMessages]
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
    .at(-1);
  const latestAnalysis = latestMessage ? parseCognitivePayload(latestMessage.analysisJson)?.analysis : null;

  return {
    id: thread.id,
    name: thread.subject?.trim() || thread.interlocuteurId,
    channel: thread.canal,
    interlocuteurId: thread.interlocuteurId,
    lastMessage: latestMessage?.content ?? thread.subject?.trim() ?? `Conversation ${thread.canal}`,
    lastMessageAt: latestMessage?.createdAt ?? thread.lastMessageAt ?? thread.updatedAt ?? thread.createdAt,
    tensionScore: latestAnalysis?.tensionScore ?? 0,
    unread: relatedMessages.filter((message) => !message.readAt).length
  };
}

function mapMessage(message: ApiMessage, currentUserId?: string | null) {
  return {
    id: message.id,
    author: message.senderUserId === currentUserId ? ('outbound' as const) : ('inbound' as const),
    content: message.content,
    timestamp: message.createdAt,
    channel: message.canal,
    cognitive: parseCognitivePayload(message.analysisJson)
  };
}

export function useMessages() {
  const { pathname } = useRoute();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ReturnType<typeof mapThread>[]>([]);
  const [messages, setMessages] = useState<ReturnType<typeof mapMessage>[]>([]);
  const activeThreadId = pathname.startsWith('/chat/thread/')
    ? pathname.replace('/chat/thread/', '')
    : null;

  useEffect(() => {
    let cancelled = false;

    const loadThreads = async () => {
      try {
        const nextThreads = await getThreads();
        const nextThreadsWithMessages = await Promise.all(
          nextThreads.map(async (thread) => {
            try {
              const threadMessages = await getMessages(thread.id);
              return mapThread(thread, threadMessages);
            } catch {
              return mapThread(thread, []);
            }
          })
        );

        if (!cancelled) {
          setThreads(nextThreadsWithMessages);
        }
      } catch {
        if (!cancelled) {
          setThreads([]);
        }
      }
    };

    void loadThreads();
    const refresh = () => void loadThreads();
    window.addEventListener(messagesRefreshEvent, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(messagesRefreshEvent, refresh);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      if (!activeThreadId) {
        setMessages([]);
        return;
      }

      try {
        const nextMessages = await getMessages(activeThreadId);
        if (!cancelled) {
          setMessages(nextMessages.map((message) => mapMessage(message, user?.id ?? null)));
        }
      } catch {
        if (!cancelled) {
          setMessages([]);
        }
      }
    };

    void loadMessages();
    const refresh = () => void loadMessages();
    window.addEventListener(messagesRefreshEvent, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(messagesRefreshEvent, refresh);
    };
  }, [activeThreadId, user?.id]);

  const activeMessages = useMemo(() => messages, [messages]);
  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads]
  );
  const latestAnalysis = useMemo(
    () => [...activeMessages].reverse().find((message) => message.cognitive)?.cognitive ?? null,
    [activeMessages]
  );

  return {
    threads,
    activeThreadId,
    activeThread,
    activeMessages,
    latestAnalysis,
    typing: false
  };
}
