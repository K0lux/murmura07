import { Inject, Injectable } from '@nestjs/common';
import { OPENCLAW_CONFIG } from '../../../config/openclaw-config.module.js';
import { type ExecutionLayerConfig } from '../../../config/openclaw.configuration.js';
import { OpenClawClientService } from '../../client/openclaw-client.service.js';
import { type ActionExecutionRequest, type ActionExecutionResult, type ActionHandler } from '../actions.types.js';

@Injectable()
export class SendMessageHandler implements ActionHandler {
  readonly actionType = 'send_message';

  constructor(
    @Inject(OPENCLAW_CONFIG) private readonly config: ExecutionLayerConfig,
    private readonly client: OpenClawClientService
  ) {}

  async execute(request: ActionExecutionRequest): Promise<ActionExecutionResult> {
    const channel = String(request.params['channel'] ?? request.params['canal'] ?? 'api');
    const content = String(request.params['content'] ?? '').trim();
    const target = String(request.params['target'] ?? request.params['threadId'] ?? '').trim();
    const callbackUrl = request.context?.['callbackUrl'];
    const autonomyLevel =
      typeof request.context?.['autonomyLevel'] === 'string' ? request.context['autonomyLevel'] : undefined;

    if (!content) {
      return { status: 'failed', summary: 'Message content is required' };
    }

    if (!this.client.isAutonomyAllowed(autonomyLevel)) {
      return {
        status: 'requires_approval',
        summary: 'Autonomy policy blocks outbound messaging until a human validates the action.',
        data: { channel, target, content }
      };
    }

    if (typeof callbackUrl === 'string' && callbackUrl) {
      this.client.ensureAllowedUrl(callbackUrl);
      const response = await fetch(callbackUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(this.config.gateway.authToken ? { authorization: `Bearer ${this.config.gateway.authToken}` } : {})
        },
        body: JSON.stringify({
          channel,
          target,
          content,
          userId: request.userId,
          context: request.context ?? {}
        }),
        signal: AbortSignal.timeout(this.config.sandbox.maxActionTimeoutMs)
      });

      const body = response.headers.get('content-type')?.includes('application/json')
        ? ((await response.json()) as Record<string, unknown>)
        : { status: response.ok ? 'accepted' : 'failed' };

      return {
        status: response.ok ? 'completed' : 'failed',
        summary: response.ok
          ? 'Outbound message executed through the configured callback.'
          : `Callback rejected the outbound message with HTTP ${response.status}.`,
        data: { channel, target, callbackUrl, response: body }
      };
    }

    return {
      status: 'completed',
      summary: 'No callback URL was configured, so the message was recorded as a dry-run.',
      data: {
        mode: 'dry_run',
        channel,
        target,
        content,
        autonomyLevel: autonomyLevel ?? this.config.sandbox.defaultAutonomyMode
      }
    };
  }
}
