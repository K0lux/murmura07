import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<{
      handshake?: { auth?: Record<string, unknown>; headers?: Record<string, string>; query?: Record<string, unknown> };
      user?: { userId: string };
    }>();

    const token =
      (typeof client.handshake?.auth?.['token'] === 'string' ? client.handshake?.auth?.['token'] : undefined) ??
      client.handshake?.headers?.['authorization']?.replace(/^Bearer\s+/i, '') ??
      (typeof client.handshake?.query?.['token'] === 'string' ? client.handshake?.query?.['token'] : undefined);

    if (!token) {
      throw new UnauthorizedException('Missing websocket token');
    }

    const payload = this.authService.verifyAccessToken(token);
    client.user = { userId: payload.sub };
    return true;
  }
}
