import { Body, Controller, Post } from '@nestjs/common';
import { SlackService } from './slack.service.js';

@Controller('webhooks/slack')
export class SlackWebhookController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  handle(@Body() body: Record<string, unknown>) {
    if (body['type'] === 'url_verification') {
      return { challenge: body['challenge'] ?? null };
    }

    return this.slackService.handleWebhook(body);
  }
}
