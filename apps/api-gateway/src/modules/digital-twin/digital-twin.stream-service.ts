import { Injectable } from '@nestjs/common';

@Injectable()
export class DigitalTwinStreamService {
  private readonly bufferedResponses = new Map<string, string>();

  setBufferedResponse(sessionId: string, response: string) {
    this.bufferedResponses.set(sessionId, response);
  }

  openStream(sessionId: string) {
    const response = this.bufferedResponses.get(sessionId) ?? '';
    return {
      sessionId,
      events: response
        .split(' ')
        .filter(Boolean)
        .map((chunk) => ({ type: 'chunk', data: `${chunk} ` }))
        .concat({ type: 'done', data: '[DONE]' })
    };
  }

  closeStream(sessionId: string) {
    this.bufferedResponses.delete(sessionId);
  }
}
