import { Module } from '@nestjs/common';
import { OpenClawConfigModule } from './config/openclaw-config.module.js';
import { OpenClawClientModule } from './modules/client/openclaw-client.module.js';
import { ActionsModule } from './modules/actions/actions.module.js';
import { WorkflowsModule } from './modules/workflows/workflows.module.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [OpenClawConfigModule, OpenClawClientModule, ActionsModule, WorkflowsModule],
  controllers: [HealthController]
})
export class AppModule {}
