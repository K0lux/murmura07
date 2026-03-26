import { Module } from '@nestjs/common';
import { DigitalTwinController } from './digital-twin.controller.js';
import { DigitalTwinService } from './digital-twin.service.js';
import { CognitiveModule } from '../cognitive/cognitive.module.js';
import { OpenClawModule } from '../openclaw/openclaw.module.js';
import { DigitalTwinSessionStore } from './digital-twin.session-store.js';
import { DigitalTwinOrchestrator } from './digital-twin.orchestrator.js';
import { DigitalTwinStreamService } from './digital-twin.stream-service.js';

@Module({
  imports: [CognitiveModule, OpenClawModule],
  controllers: [DigitalTwinController],
  providers: [
    DigitalTwinService,
    DigitalTwinSessionStore,
    DigitalTwinOrchestrator,
    DigitalTwinStreamService
  ],
  exports: [DigitalTwinService]
})
export class DigitalTwinModule {}

