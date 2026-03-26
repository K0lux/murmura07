export class SendMessageDto {
  content!: string;
  attachments?: Array<{ name: string; url: string }>;
  replyToId?: string;
}
