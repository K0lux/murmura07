import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service.js';
import { WhatsappService } from './whatsapp/whatsapp.service.js';
import { EmailService } from './email/email.service.js';
import { SlackService } from './slack/slack.service.js';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(
    private readonly telegramService: TelegramService,
    private readonly whatsappService: WhatsappService,
    private readonly emailService: EmailService,
    private readonly slackService: SlackService
  ) {}

  async sendMessage(canal: string, to: string, content: string) {
    switch (canal) {
      case 'telegram':
        return this.telegramService.sendMessage(to, content);
      case 'whatsapp':
      case 'sms':
        return this.whatsappService.sendMessage(to, content);
      case 'email':
        return this.emailService.sendMessage(to, content);
      case 'slack':
        return this.slackService.sendMessage(to, content);
      case 'api':
      case 'internal':
        this.logger.debug(`Skipping external delivery for canal=${canal}`);
        return { status: 'skipped', canal, to };
      default:
        this.logger.warn(`Unknown channel: ${canal}`);
        return { status: 'unsupported', canal, to };
    }
  }
}
