import { useContext } from 'react';
import { WebSocketContext } from '../providers/websocket.provider';

export function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return {
    ...context,
    subscribe: (_event: string, _callback: (payload: unknown) => void) => () => undefined
  };
}
