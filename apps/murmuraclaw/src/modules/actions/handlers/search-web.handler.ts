import { Injectable } from '@nestjs/common';
import { OpenClawClientService } from '../../client/openclaw-client.service.js';
import { type ActionExecutionRequest, type ActionExecutionResult, type ActionHandler } from '../actions.types.js';

@Injectable()
export class SearchWebHandler implements ActionHandler {
  readonly actionType = 'search_web';

  constructor(private readonly client: OpenClawClientService) {}

  async execute(request: ActionExecutionRequest): Promise<ActionExecutionResult> {
    const query = String(request.params['query'] ?? '').trim();
    const includeMemory = request.params['includeMemory'] === true;
    const limitValue = request.params['limit'];
    const limit = typeof limitValue === 'number' ? limitValue : undefined;

    if (!query) {
      return { status: 'failed', summary: 'Search query is required' };
    }

    const agentResult = await this.client.query(
      'web-researcher',
      `Search the web for: ${query}. Return high-signal results and highlight uncertainty.`
    );

    const memoryResults = includeMemory ? await this.client.executeMemorySearch(request.userId, query, limit) : [];

    return {
      status: 'completed',
      summary: 'Research request executed through the web-researcher agent.',
      data: {
        query,
        agent: agentResult,
        memoryResults,
        note: 'When a remote OpenClaw backend is unavailable, this handler falls back to a deterministic local summary.'
      }
    };
  }
}
