import { useSyncExternalStore } from 'react';

export type ThreadPreviewAction = {
  id: string;
  label: string;
  target: 'message' | 'assistant';
  kind: 'open-thread' | 'memory' | 'relationships' | 'draft-reply' | 'digital-twin';
};

export type ThreadPreviewState = {
  threadId: string;
  name: string;
  channel: string;
  lastMessage: string;
  tensionScore: number;
  unread: number;
  relationshipLabel: string;
  summary: string;
  messageActions: ThreadPreviewAction[];
  assistantActions: ThreadPreviewAction[];
};

let currentPreview: ThreadPreviewState | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentPreview;
}

export function setThreadPreview(preview: ThreadPreviewState | null) {
  currentPreview = preview;
  emitChange();
}

export function useThreadPreview() {
  const preview = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return {
    preview,
    setPreview: setThreadPreview,
    clearPreview: () => setThreadPreview(null)
  };
}
