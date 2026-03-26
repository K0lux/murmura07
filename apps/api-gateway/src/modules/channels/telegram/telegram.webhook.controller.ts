import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';

@Controller('webhooks/telegram')
export class TelegramWebhookController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  handle(@Body() body: Record<string, unknown>) {
    return this.telegramService.handleWebhook(body);
  }
}
