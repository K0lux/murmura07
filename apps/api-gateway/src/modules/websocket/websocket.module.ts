import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway.js';

@Module({
  providers: [WebsocketGateway]
})
export class WebsocketModule {}

