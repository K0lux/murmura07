import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'node:events';

@Injectable()
export class WebsocketGateway {
  private readonly logger = new Logger(WebsocketGateway.name);
  private readonly events = new EventEmitter();

  emitToUser(userId: string, event: string, payload: unknown) {
    this.logger.debug(`emit ${event} to ${userId}`);
    this.events.emit(`${userId}:${event}`, payload);
  }

  subscribe(userId: string, event: string, listener: (payload: unknown) => void) {
    this.events.on(`${userId}:${event}`, listener);
    return () => this.events.off(`${userId}:${event}`, listener);
  }
}
