import { createContext, useMemo, type ReactNode } from 'react';

type WebSocketContextValue = {
  status: 'connected' | 'connecting';
  send: (payload: string) => void;
};

export const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      status: 'connected' as const,
      send: (_payload: string) => undefined
    }),
    []
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
