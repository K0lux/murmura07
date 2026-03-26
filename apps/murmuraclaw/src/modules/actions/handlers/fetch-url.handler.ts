import { Injectable } from '@nestjs/common';
import { OpenClawClientService } from '../../client/openclaw-client.service.js';
import { type ActionExecutionRequest, type ActionExecutionResult, type ActionHandler } from '../actions.types.js';

@Injectable()
export class FetchUrlHandler implements ActionHandler {
  readonly actionType = 'fetch_url';

  constructor(private readonly client: OpenClawClientService) {}

  async execute(request: ActionExecutionRequest): Promise<ActionExecutionResult> {
    const url = String(request.params['url'] ?? '').trim();
    if (!url) {
      return { status: 'failed', summary: 'URL is required' };
    }

    const payload = await this.client.fetchTextFromUrl(url);

    return {
      status: 'completed',
      summary: 'URL fetched inside the execution sandbox.',
      data: {
        ...payload,
        excerpt: payload.content.slice(0, 800)
      }
    };
  }
}
