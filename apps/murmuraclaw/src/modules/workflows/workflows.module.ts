import { Module } from '@nestjs/common';
import { OpenClawClientModule } from '../client/openclaw-client.module.js';
import { ActionsModule } from '../actions/actions.module.js';
import { WorkflowsController } from './workflows.controller.js';
import { WorkflowsService } from './workflows.service.js';
import { ResearchWorkflow } from './definitions/research.workflow.js';
import { ContextEnrichmentWorkflow } from './definitions/context-enrichment.workflow.js';

@Module({
  imports: [OpenClawClientModule, ActionsModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, ResearchWorkflow, ContextEnrichmentWorkflow]
})
export class WorkflowsModule {}
