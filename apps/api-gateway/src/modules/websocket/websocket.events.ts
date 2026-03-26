export const WebsocketEvents = {
  ANALYSIS_COMPLETE: 'analysis:complete',
  SUGGESTION_READY: 'suggestion:ready',
  ALERT_TRIGGERED: 'alert:triggered',
  MESSAGE_NEW: 'message:new',
  MESSAGE_TYPING: 'message:typing',
  TWIN_STREAM_CHUNK: 'twin:stream:chunk',
  TWIN_STREAM_DONE: 'twin:stream:done',
  INTERNAL_MESSAGE_NEW: 'internal:message:new',
  INTERNAL_PRESENCE_UPDATE: 'internal:presence:update',
  INTERNAL_ANALYSIS_READY: 'internal:analysis:ready'
} as const;
