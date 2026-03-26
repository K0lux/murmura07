import { Body, Controller, Post } from '@nestjs/common';
import { WorkflowsService } from './workflows.service.js';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post('trigger')
  trigger(@Body() body: { workflowId?: string; context?: Record<string, unknown> }) {
    return this.workflowsService.trigger({
      workflowId: body.workflowId ?? '',
      context: body.context ?? {}
    });
  }
}
