import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MURMURA_CONFIG } from '../../infrastructure/config/config.module.js';
import type { MurmuraConfiguration } from '../../infrastructure/config/configuration.js';

@Injectable()
export class OpenClawService {
  constructor(
    @Inject(MURMURA_CONFIG) private readonly config: MurmuraConfiguration
  ) {}

  async executeAction(
    actionType: string,
    params: Record<string, unknown>,
    options?: { userId?: string; context?: Record<string, unknown> }
  ) {
    return this.requestJson('/actions/execute', {
      method: 'POST',
      body: JSON.stringify({
        actionType,
        params,
        userId: options?.userId ?? 'gateway',
        context: options?.context ?? {}
      })
    });
  }

  async getAgentStatus(agentId?: string) {
    if (agentId) {
      return this.requestJson(`/agents/${agentId}/status`);
    }

    return this.requestJson('/health');
  }

  async triggerWorkflow(workflowId: string, context: Record<string, unknown>) {
    return this.requestJson('/workflows/trigger', {
      method: 'POST',
      body: JSON.stringify({ workflowId, context })
    });
  }

  async listAgents() {
    return this.requestJson('/agents');
  }

  private async requestJson(endpoint: string, init: RequestInit = {}) {
    const response = await fetch(`${this.config.openclaw.baseUrl}${endpoint}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init.headers ?? {})
      },
      signal: AbortSignal.timeout(this.config.openclaw.timeoutMs)
    });

    const payload = response.headers.get('content-type')?.includes('application/json')
      ? ((await response.json()) as Record<string, unknown>)
      : { message: await response.text() };

    if (!response.ok) {
      throw new HttpException(
        {
          message: `OpenClaw request failed with HTTP ${response.status}`,
          endpoint,
          payload
        },
        response.status === 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_GATEWAY
      );
    }

    return payload;
  }
}
