import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { OPENCLAW_CONFIG } from '../../config/openclaw-config.module.js';
import { type ExecutionLayerConfig } from '../../config/openclaw.configuration.js';
import { ResearchWorkflow } from './definitions/research.workflow.js';
import { ContextEnrichmentWorkflow } from './definitions/context-enrichment.workflow.js';
import { type WorkflowDefinition, type WorkflowTriggerRequest } from './workflows.types.js';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);
  private readonly workflows: Map<string, WorkflowDefinition>;

  constructor(
    @Inject(OPENCLAW_CONFIG) private readonly config: ExecutionLayerConfig,
    researchWorkflow: ResearchWorkflow,
    contextEnrichmentWorkflow: ContextEnrichmentWorkflow
  ) {
    this.workflows = new Map(
      [researchWorkflow, contextEnrichmentWorkflow].map((workflow) => [workflow.workflowId, workflow])
    );
  }

  async trigger(request: WorkflowTriggerRequest) {
    if (!request.workflowId.trim()) {
      throw new ServiceUnavailableException('workflowId is required');
    }

    const workflow = this.workflows.get(request.workflowId);
    if (!workflow) {
      throw new ServiceUnavailableException(`Unsupported workflow: ${request.workflowId}`);
    }

    const startedAt = Date.now();
    this.logger.log(`Triggering workflow ${request.workflowId}`);
    const result = await this.withTimeout(
      workflow.execute(request.context),
      this.config.sandbox.maxWorkflowTimeoutMs
    );

    return {
      workflowId: request.workflowId,
      status: 'completed',
      durationMs: Date.now() - startedAt,
      result
    };
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let handle: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      handle = setTimeout(() => {
        reject(new ServiceUnavailableException(`Workflow exceeded timeout of ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (handle) {
        clearTimeout(handle);
      }
    }
  }
}
