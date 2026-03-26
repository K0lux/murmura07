import { Injectable } from '@nestjs/common';
import { ActionsService } from '../../actions/actions.service.js';
import { OpenClawClientService } from '../../client/openclaw-client.service.js';
import { type WorkflowDefinition } from '../workflows.types.js';

@Injectable()
export class ResearchWorkflow implements WorkflowDefinition {
  readonly workflowId = 'research';

  constructor(
    private readonly actionsService: ActionsService,
    private readonly client: OpenClawClientService
  ) {}

  async execute(context: Record<string, unknown>) {
    const userId = String(context['userId'] ?? 'system');
    const query = String(context['query'] ?? '').trim();
    const seedUrls = Array.isArray(context['seedUrls'])
      ? context['seedUrls'].filter((item): item is string => typeof item === 'string')
      : [];

    if (!query) {
      throw new Error('research workflow requires context.query');
    }

    const search = await this.actionsService.execute({
      actionType: 'search_web',
      params: { query, includeMemory: true, limit: 5 },
      userId,
      context
    });

    const fetchedSources: Array<Record<string, unknown>> = [];
    for (const url of seedUrls.slice(0, 3)) {
      const fetched = await this.actionsService.execute({
        actionType: 'fetch_url',
        params: { url },
        userId,
        context
      });
      fetchedSources.push(fetched);
    }

    const today = new Date().toISOString().slice(0, 10);
    const summary = [
      '## Research workflow',
      `- Date: ${today}`,
      `- Query: ${query}`,
      `- Search summary: ${search.summary}`,
      `- Seed URLs fetched: ${fetchedSources.length}`,
      ''
    ].join('\n');

    const persisted = await this.client.appendWorkspaceMarkdown(userId, `memory/${today}.md`, `${summary}\n`);

    return {
      storedIn: persisted.filePath,
      search,
      fetchedSources,
      summary: `Research workflow completed for "${query}" and persisted to daily memory.`
    };
  }
}
