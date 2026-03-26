import { Injectable } from '@nestjs/common';
import { OpenClawClientService } from '../../client/openclaw-client.service.js';
import { type ActionExecutionRequest, type ActionExecutionResult, type ActionHandler } from '../actions.types.js';

@Injectable()
export class CalendarHandler implements ActionHandler {
  readonly actionType = 'calendar';

  constructor(private readonly client: OpenClawClientService) {}

  async execute(request: ActionExecutionRequest): Promise<ActionExecutionResult> {
    const operation = String(request.params['operation'] ?? 'read_availability');
    const date = String(request.params['date'] ?? new Date().toISOString().slice(0, 10));
    const timezone = String(request.params['timezone'] ?? 'UTC');

    const agent = await this.client.query(
      'calendar-assistant',
      `Operation=${operation}; date=${date}; timezone=${timezone}; params=${JSON.stringify(request.params)}`
    );

    const slots =
      operation === 'propose_slots'
        ? [`${date}T09:00:00`, `${date}T11:30:00`, `${date}T15:00:00`]
        : [];

    return {
      status: 'completed',
      summary: 'Calendar action processed with the calendar-assistant agent.',
      data: {
        operation,
        timezone,
        date,
        slots,
        agent,
        mode: agent.remote ? 'remote' : 'simulated'
      }
    };
  }
}
