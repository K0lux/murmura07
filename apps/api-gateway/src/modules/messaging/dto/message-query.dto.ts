export class MessageQueryDto {
  cursor?: string;
  limit?: number;
  direction?: 'before' | 'after';
}
