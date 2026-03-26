export type ChatStoreState = {
  activeThreadId: string | null;
  unreadCounts: Record<string, number>;
};

export const chatStoreInitialState: ChatStoreState = {
  activeThreadId: null,
  unreadCounts: {}
};
