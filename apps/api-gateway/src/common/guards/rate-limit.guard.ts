import { CanActivate, ExecutionContext, Injectable, TooManyRequestsException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { RedisService } from '../../infrastructure/redis/redis.service.js';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private globalLimit = Number(process.env.RATE_LIMIT_GLOBAL_PER_MIN ?? 300);
  private userLimit = Number(process.env.RATE_LIMIT_USER_PER_MIN ?? 120);
  private analyzeLimit = Number(process.env.RATE_LIMIT_ANALYZE_PER_MIN ?? 30);
  private dailyQuota = Number(process.env.RATE_LIMIT_USER_DAILY ?? 1000);

  constructor(private readonly redis: RedisService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const userId = request.user?.userId ?? (isPublic ? undefined : 'anonymous');
    const ip = request.ip ?? request.headers['x-forwarded-for'] ?? 'unknown';
    const path = request.originalUrl ?? request.url ?? '';
    const isAnalyze = path.includes('/v1/analyze');

    await this.checkWindowLimit(`rate:global:${this.windowKey(60)}`, this.globalLimit, 60);

    const principal = userId ?? `ip:${ip}`;
    await this.checkWindowLimit(`rate:user:${principal}:${this.windowKey(60)}`, this.userLimit, 60);

    if (isAnalyze) {
      await this.checkWindowLimit(`rate:analyze:${principal}:${this.windowKey(60)}`, this.analyzeLimit, 60);
      await this.checkDailyQuota(`quota:${principal}:${this.dateKey()}`, this.dailyQuota);
    }

    return true;
  }

  private windowKey(windowSeconds: number) {
    return Math.floor(Date.now() / (windowSeconds * 1000));
  }

  private dateKey() {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  private async checkWindowLimit(key: string, limit: number, windowSeconds: number) {
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, windowSeconds);
    }
    if (count > limit) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }
  }

  private async checkDailyQuota(key: string, limit: number) {
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, 60 * 60 * 48);
    }
    if (count > limit) {
      throw new TooManyRequestsException('Daily quota exceeded');
    }
  }
}

