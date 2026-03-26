import { Module } from '@nestjs/common';
import { OpenClawModule } from '../openclaw/openclaw.module.js';
import { ChannelsService } from './channels.service.js';
import { TelegramService } from './telegram/telegram.service.js';
import { TelegramWebhookController } from './telegram/telegram.webhook.controller.js';
import { WhatsappService } from './whatsapp/whatsapp.service.js';
import { WhatsappWebhookController } from './whatsapp/whatsapp.webhook.controller.js';
import { EmailService } from './email/email.service.js';
import { EmailPoller } from './email/email.poller.js';
import { SlackService } from './slack/slack.service.js';
import { SlackWebhookController } from './slack/slack.webhook.controller.js';

@Module({
  imports: [OpenClawModule],
  controllers: [TelegramWebhookController, WhatsappWebhookController, SlackWebhookController],
  providers: [
    ChannelsService,
    TelegramService,
    WhatsappService,
    EmailService,
    EmailPoller,
    SlackService
  ],
  exports: [ChannelsService, TelegramService, WhatsappService, EmailService, SlackService]
})
export class ChannelsModule {}
