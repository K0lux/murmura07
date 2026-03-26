export const websocketEvents = {
  newMessage: 'new_message',
  analysisReady: 'analysis_ready',
  alertTriggered: 'alert_triggered',
  suggestionReady: 'suggestion_ready'
} as const;

export type WebSocketEventName = (typeof websocketEvents)[keyof typeof websocketEvents];

export function serializeMessage<T>(event: WebSocketEventName, payload: T) {
  return JSON.stringify({ event, payload });
}

export function deserializeMessage<T>(value: string) {
  return JSON.parse(value) as { event: WebSocketEventName; payload: T };
}
