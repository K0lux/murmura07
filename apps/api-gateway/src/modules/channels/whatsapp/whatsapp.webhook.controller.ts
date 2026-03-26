import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service.js';

@Controller('webhooks/whatsapp')
export class WhatsappWebhookController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  verify(@Query('hub.challenge') challenge?: string) {
    return { challenge: challenge ?? null };
  }

  @Post()
  handle(@Body() body: Record<string, unknown>) {
    return this.whatsappService.handleWebhook(body);
  }
}
