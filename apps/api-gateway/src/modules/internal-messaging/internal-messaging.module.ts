import { Module } from '@nestjs/common';
import { InternalMessagingController } from './internal-messaging.controller.js';
import { InternalMessagingService } from './internal-messaging.service.js';
import { CognitiveModule } from '../cognitive/cognitive.module.js';
import { WebsocketModule } from '../websocket/websocket.module.js';

@Module({
  imports: [CognitiveModule, WebsocketModule],
  controllers: [InternalMessagingController],
  providers: [InternalMessagingService]
})
export class InternalMessagingModule {}

