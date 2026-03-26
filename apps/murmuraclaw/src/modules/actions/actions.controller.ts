import { Body, Controller, Post } from '@nestjs/common';
import { ActionsService } from './actions.service.js';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post('execute')
  execute(
    @Body()
    body: {
      actionType?: string;
      params?: Record<string, unknown>;
      userId?: string;
      context?: Record<string, unknown>;
    }
  ) {
    return this.actionsService.execute({
      actionType: body.actionType ?? '',
      params: body.params ?? {},
      userId: body.userId ?? 'system',
      context: body.context ?? {}
    });
  }
}
