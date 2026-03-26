import { Injectable } from '@nestjs/common';
import { ActionsService } from '../../actions/actions.service.js';
import { OpenClawClientService } from '../../client/openclaw-client.service.js';
import { type WorkflowDefinition } from '../workflows.types.js';

@Injectable()
export class ContextEnrichmentWorkflow implements WorkflowDefinition {
  readonly workflowId = 'context-enrichment';

  constructor(
    private readonly actionsService: ActionsService,
    private readonly client: OpenClawClientService
  ) {}

  async execute(context: Record<string, unknown>) {
    const userId = String(context['userId'] ?? 'system');
    const relationshipId = String(context['relationshipId'] ?? context['interlocutorId'] ?? '').trim();
    const subject = String(context['subject'] ?? context['displayName'] ?? relationshipId).trim();

    if (!relationshipId) {
      throw new Error('context-enrichment workflow requires context.relationshipId');
    }

    const search = await this.actionsService.execute({
      actionType: 'search_web',
      params: { query: subject, includeMemory: false, limit: 3 },
      userId,
      context
    });

    const entry = [
      '## Context enrichment',
      `- Subject: ${subject}`,
      `- Updated at: ${new Date().toISOString()}`,
      `- Summary: ${search.summary}`,
      ''
    ].join('\n');

    const persisted = await this.client.appendWorkspaceMarkdown(
      userId,
      `relationships/${relationshipId}.md`,
      `${entry}\n`
    );

    return {
      storedIn: persisted.filePath,
      relationshipId,
      search,
      summary: `Context enrichment persisted for ${relationshipId}.`
    };
  }
}
