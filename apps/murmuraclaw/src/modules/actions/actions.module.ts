import { Module } from '@nestjs/common';
import { OpenClawClientModule } from '../client/openclaw-client.module.js';
import { ActionsController } from './actions.controller.js';
import { ActionsService } from './actions.service.js';
import { SendMessageHandler } from './handlers/send-message.handler.js';
import { SearchWebHandler } from './handlers/search-web.handler.js';
import { FetchUrlHandler } from './handlers/fetch-url.handler.js';
import { CalendarHandler } from './handlers/calendar.handler.js';

@Module({
  imports: [OpenClawClientModule],
  controllers: [ActionsController],
  providers: [ActionsService, SendMessageHandler, SearchWebHandler, FetchUrlHandler, CalendarHandler],
  exports: [ActionsService]
})
export class ActionsModule {}
