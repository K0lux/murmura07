import { Module } from '@nestjs/common';
import { InternalMessagingController } from './internal-messaging.controller.js';
import { InternalMessagingService } from './internal-messaging.service.js';

@Module({
  controllers: [InternalMessagingController],
  providers: [InternalMessagingService]
})
export class InternalMessagingModule {}

