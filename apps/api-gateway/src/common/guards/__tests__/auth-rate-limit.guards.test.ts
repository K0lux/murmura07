import { HttpException, UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtAuthGuard } from '../jwt-auth.guard.js';
import { RateLimitGuard } from '../rate-limit.guard.js';

function createExecutionContext(request: Record<string, unknown> = {}) {
  return {
    switchToHttp: () => ({
      getRequest: () => request
    }),
    getHandler: () => 'handler',
    getClass: () => 'class'
  };
}

describe('JwtAuthGuard', () => {
  const reflector = {
    getAllAndOverride: vi.fn()
  };
  const authService = {
    verifyAccessToken: vi.fn()
  };

  let guard: JwtAuthGuard;

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new JwtAuthGuard(reflector as never, authService as never);
  });

  it('allows public routes without authentication', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(true);

    expect(guard.canActivate(createExecutionContext() as never)).toBe(true);
  });

  it('rejects missing authorization headers', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false);

    expect(() => guard.canActivate(createExecutionContext({ headers: {} }) as never)).toThrow(
      new UnauthorizedException('Missing Authorization header')
    );
  });

  it('sets request.user when the token is valid', () => {
    reflector.getAllAndOverride.mockReturnValueOnce(false);
    authService.verifyAccessToken.mockReturnValueOnce({ sub: 'user-1' });
    const request = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };

    expect(guard.canActivate(createExecutionContext(request) as never)).toBe(true);
    expect(request).toMatchObject({
      user: { userId: 'user-1' }
    });
  });

  it('rejects malformed authorization headers and invalid tokens', () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    expect(() =>
      guard.canActivate(
        createExecutionContext({
          headers: {
            authorization: 'Bearer'
          }
        }) as never
      )
    ).toThrow(new UnauthorizedException('Invalid Authorization header'));

    authService.verifyAccessToken.mockImplementationOnce(() => {
      throw new Error('bad token');
    });

    expect(() =>
      guard.canActivate(
        createExecutionContext({
          headers: {
            authorization: 'Bearer invalid-token'
          }
        }) as never
      )
    ).toThrow(new UnauthorizedException('Invalid token'));
  });
});

describe('RateLimitGuard', () => {
  const counters = new Map<string, number>();
  const ttls = new Map<string, number>();
  const redis = {
    incr: vi.fn(async (key: string) => {
      const next = (counters.get(key) ?? 0) + 1;
      counters.set(key, next);
      return next;
    }),
    expire: vi.fn(async (key: string, ttl: number) => {
      ttls.set(key, ttl);
    })
  };
  const reflector = {
    getAllAndOverride: vi.fn()
  };

  let guard: RateLimitGuard;

  beforeEach(() => {
    vi.clearAllMocks();
    counters.clear();
    ttls.clear();
    process.env['RATE_LIMIT_GLOBAL_PER_MIN'] = '10';
    process.env['RATE_LIMIT_USER_PER_MIN'] = '2';
    process.env['RATE_LIMIT_ANALYZE_PER_MIN'] = '1';
    process.env['RATE_LIMIT_USER_DAILY'] = '2';
    guard = new RateLimitGuard(redis as never, reflector as never);
  });

  it('allows requests under the configured limits', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const request = {
      user: { userId: 'user-1' },
      ip: '127.0.0.1',
      headers: {},
      originalUrl: '/v1/context/session-1',
      url: '/v1/context/session-1'
    };

    await expect(guard.canActivate(createExecutionContext(request) as never)).resolves.toBe(true);
    expect(redis.expire).toHaveBeenCalled();
  });

  it('blocks requests when analyze rate limit is exceeded', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const request = {
      user: { userId: 'user-1' },
      ip: '127.0.0.1',
      headers: {},
      originalUrl: '/v1/analyze',
      url: '/v1/analyze'
    };

    await expect(guard.canActivate(createExecutionContext(request) as never)).resolves.toBe(true);
    await expect(guard.canActivate(createExecutionContext(request) as never)).rejects.toThrow(
      new HttpException('Rate limit exceeded', 429)
    );
  });

  it('blocks requests when the daily analyze quota is exceeded', async () => {
    process.env['RATE_LIMIT_GLOBAL_PER_MIN'] = '100';
    process.env['RATE_LIMIT_USER_PER_MIN'] = '100';
    process.env['RATE_LIMIT_ANALYZE_PER_MIN'] = '100';
    process.env['RATE_LIMIT_USER_DAILY'] = '1';
    guard = new RateLimitGuard(redis as never, reflector as never);
    reflector.getAllAndOverride.mockReturnValue(false);

    const request = {
      user: { userId: 'user-2' },
      ip: '127.0.0.1',
      headers: {},
      originalUrl: '/v1/analyze',
      url: '/v1/analyze'
    };

    await expect(guard.canActivate(createExecutionContext(request) as never)).resolves.toBe(true);
    await expect(guard.canActivate(createExecutionContext(request) as never)).rejects.toThrow(
      new HttpException('Daily quota exceeded', 429)
    );
  });
});
