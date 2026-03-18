export class UpdateIdentityDto {
  communicationStyle?: {
    formality?: 'low' | 'medium' | 'high';
    tone?: 'direct' | 'diplomatic' | 'warm' | 'neutral';
  };
  confrontationLevel?: number;
  riskTolerance?: number;
  coreValues?: string[];
}
