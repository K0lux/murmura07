import { Module } from '@nestjs/common';
import { DigitalTwinController } from './digital-twin.controller.js';
import { DigitalTwinService } from './digital-twin.service.js';

@Module({
  controllers: [DigitalTwinController],
  providers: [DigitalTwinService]
})
export class DigitalTwinModule {}

