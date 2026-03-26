export class CreateThreadDto {
  interlocuteurId!: string;
  canal?: 'email' | 'telegram' | 'whatsapp' | 'slack' | 'sms' | 'api' | 'internal';
  subject?: string;
}
