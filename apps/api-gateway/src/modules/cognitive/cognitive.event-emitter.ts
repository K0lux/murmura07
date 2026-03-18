import { EventEmitter } from 'node:events';

export class CognitiveEventEmitter extends EventEmitter {
  emitAnalysisComplete(payload: unknown) {
    this.emit('analysis.complete', payload);
  }

  emitSuggestionReady(payload: unknown) {
    this.emit('suggestion.ready', payload);
  }

  emitAlertTriggered(payload: unknown) {
    this.emit('alert.triggered', payload);
  }
}
