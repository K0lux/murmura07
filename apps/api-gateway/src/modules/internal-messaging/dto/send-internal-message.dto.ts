export class SendInternalMessageDto {
  content!: string;
  contentEncrypted?: string;
  replyToId?: string;
  clientMessageId?: string;
}
