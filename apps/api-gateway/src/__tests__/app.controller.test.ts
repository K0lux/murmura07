import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppController } from '../app.controller.js';

describe('AppController', () => {
  const prisma = {
    $queryRaw: vi.fn()
  };
  const redis = {
    ping: vi.fn()
  };

  let controller: AppController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new AppController(prisma as never, redis as never);
  });

  it('returns basic root metadata', async () => {
    const response = await controller.getRoot();

    expect(response.name).toBe('Murmura API Gateway');
    expect(response.status).toBe('ok');
    expect(typeof response.uptimeSeconds).toBe('number');
  });

  it('returns healthy when database and redis are up', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
    redis.ping.mockResolvedValueOnce('PONG');

    const response = await controller.getHealth();

    expect(response.status).toBe('healthy');
    expect(response.checks).toEqual({
      database: { status: 'up' },
      redis: { status: 'up', ping: 'PONG' }
    });
  });

  it('returns degraded when a dependency is down', async () => {
    prisma.$queryRaw.mockRejectedValueOnce(new Error('database offline'));
    redis.ping.mockResolvedValueOnce('PONG');

    const response = await controller.getHealth();

    expect(response.status).toBe('degraded');
    expect(response.checks.database).toEqual({
      status: 'down',
      message: 'database offline'
    });
    expect(response.checks.redis).toEqual({
      status: 'up',
      ping: 'PONG'
    });
  });

  it('returns degraded when redis is down', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
    redis.ping.mockRejectedValueOnce(new Error('redis offline'));

    const response = await controller.getHealth();

    expect(response.status).toBe('degraded');
    expect(response.checks.database).toEqual({ status: 'up' });
    expect(response.checks.redis).toEqual({
      status: 'down',
      message: 'redis offline'
    });
  });
});
