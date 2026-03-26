import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  async sendMessage(to: string, content: string) {
    return { canal: 'telegram', to, content, sent: true };
  }

  async handleWebhook(update: Record<string, unknown>) {
    return { received: true, canal: 'telegram', update };
  }
}
