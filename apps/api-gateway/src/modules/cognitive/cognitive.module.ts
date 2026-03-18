import { Module } from '@nestjs/common';
import { CognitiveService } from './cognitive.service.js';
import { CognitiveEventEmitter } from './cognitive.event-emitter.js';
import { AnalyzeController } from './analyze/analyze.controller.js';
import { MemoryController } from './memory/memory.controller.js';
import { IdentityController } from './identity/identity.controller.js';
import { RelationshipsController } from './relationships/relationships.controller.js';
import { GovernanceController } from './governance/governance.controller.js';
import { ContextController } from './context/context.controller.js';

@Module({
  controllers: [
    AnalyzeController,
    MemoryController,
    IdentityController,
    RelationshipsController,
    GovernanceController,
    ContextController
  ],
  providers: [CognitiveService, CognitiveEventEmitter],
  exports: [CognitiveService, CognitiveEventEmitter]
})
export class CognitiveModule {}

