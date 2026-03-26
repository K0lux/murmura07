import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendMessage(to: string, content: string) {
    return {
      canal: 'email',
      to,
      content,
      sent: true
    };
  }
}
