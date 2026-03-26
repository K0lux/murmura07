import { Module } from '@nestjs/common';
import { OpenClawClientService } from './openclaw-client.service.js';

@Module({
  providers: [OpenClawClientService],
  exports: [OpenClawClientService]
})
export class OpenClawClientModule {}
