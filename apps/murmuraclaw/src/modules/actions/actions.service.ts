import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { OPENCLAW_CONFIG } from '../../config/openclaw-config.module.js';
import { type ExecutionLayerConfig } from '../../config/openclaw.configuration.js';
import { SendMessageHandler } from './handlers/send-message.handler.js';
import { SearchWebHandler } from './handlers/search-web.handler.js';
import { FetchUrlHandler } from './handlers/fetch-url.handler.js';
import { CalendarHandler } from './handlers/calendar.handler.js';
import { type ActionExecutionRequest, type ActionHandler } from './actions.types.js';

@Injectable()
export class ActionsService {
  private readonly logger = new Logger(ActionsService.name);
  private readonly handlers: Map<string, ActionHandler>;

  constructor(
    @Inject(OPENCLAW_CONFIG) private readonly config: ExecutionLayerConfig,
    sendMessageHandler: SendMessageHandler,
    searchWebHandler: SearchWebHandler,
    fetchUrlHandler: FetchUrlHandler,
    calendarHandler: CalendarHandler
  ) {
    this.handlers = new Map(
      [sendMessageHandler, searchWebHandler, fetchUrlHandler, calendarHandler].map((handler) => [
        handler.actionType,
        handler
      ])
    );
  }

  async execute(request: ActionExecutionRequest) {
    if (!request.actionType.trim()) {
      throw new ServiceUnavailableException('actionType is required');
    }

    const startedAt = Date.now();
    const handler = this.handlers.get(request.actionType);

    if (!handler) {
      throw new ServiceUnavailableException(`Unsupported action type: ${request.actionType}`);
    }

    const executionId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.logger.log(`Executing action ${request.actionType} (${executionId}) for ${request.userId}`);

    const result = await this.withTimeout(handler.execute(request), this.config.sandbox.maxActionTimeoutMs);

    this.logger.log(
      `Action ${request.actionType} (${executionId}) completed with status=${result.status} in ${Date.now() - startedAt}ms`
    );

    return {
      executionId,
      actionType: request.actionType,
      userId: request.userId,
      status: result.status,
      summary: result.summary,
      data: result.data ?? {},
      durationMs: Date.now() - startedAt
    };
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let handle: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      handle = setTimeout(() => {
        reject(new ServiceUnavailableException(`Action exceeded timeout of ${timeoutMs}ms`));
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
