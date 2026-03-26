import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  async sendMessage(to: string, content: string) {
    return { canal: 'whatsapp', to, content, sent: true };
  }

  async handleWebhook(payload: Record<string, unknown>) {
    return { received: true, canal: 'whatsapp', payload };
  }
}
