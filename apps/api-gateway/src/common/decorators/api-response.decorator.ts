import { SetMetadata } from '@nestjs/common';

export const API_RESPONSE_METADATA_KEY = 'api:murmura:response';

export function ApiMurmuraResponse(description?: string) {
  return SetMetadata(API_RESPONSE_METADATA_KEY, {
    description: description ?? 'Standard Murmura API response envelope'
  });
}
