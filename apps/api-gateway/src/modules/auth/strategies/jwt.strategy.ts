import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';

@Injectable()
export class JwtStrategy {
  constructor(private readonly authService: AuthService) {}

  validate(token: string) {
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const payload = this.authService.verifyAccessToken(token);
    return { userId: payload.sub, tokenType: payload.type ?? 'access' };
  }
}
