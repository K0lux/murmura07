import { Module } from '@nestjs/common';
import { CognitiveModule } from '../cognitive/cognitive.module.js';
import { ChannelsModule } from '../channels/channels.module.js';
import { WebsocketModule } from '../websocket/websocket.module.js';
import { ThreadsController } from './threads/threads.controller.js';
import { MessagesController } from './messages/messages.controller.js';
import { ThreadsService } from './threads/threads.service.js';
import { MessagesService } from './messages/messages.service.js';
import { ThreadsRepository } from './threads/threads.repository.js';
import { MessagesRepository } from './messages/messages.repository.js';

@Module({
  imports: [CognitiveModule, ChannelsModule, WebsocketModule],
  controllers: [ThreadsController, MessagesController],
  providers: [ThreadsService, MessagesService, ThreadsRepository, MessagesRepository],
  exports: [ThreadsService, MessagesService]
})
export class MessagingModule {}
