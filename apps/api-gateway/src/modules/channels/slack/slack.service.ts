import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackService {
  async sendMessage(to: string, content: string) {
    return { canal: 'slack', to, content, sent: true };
  }

  async handleWebhook(payload: Record<string, unknown>) {
    return { received: true, canal: 'slack', payload };
  }
}
