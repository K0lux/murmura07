import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';

@Injectable()
export class LocalStrategy {
  constructor(private readonly authService: AuthService) {}

  async validate(email?: string, password?: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Missing credentials');
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
