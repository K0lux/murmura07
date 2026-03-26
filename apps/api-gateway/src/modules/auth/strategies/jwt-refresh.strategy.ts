import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';

@Injectable()
export class JwtRefreshStrategy {
  constructor(private readonly authService: AuthService) {}

  validate(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const payload = this.authService.verifyRefreshTokenForStrategy(refreshToken);
    return { userId: payload.sub, tokenType: payload.type ?? 'refresh' };
  }
}
