import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator.js';
import { PrismaService } from './infrastructure/database/prisma.service.js';
import { RedisService } from './infrastructure/redis/redis.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  @Public()
  @Get()
  async getRoot() {
    return {
      name: 'Murmura API Gateway',
      version: process.env['npm_package_version'] ?? '0.0.0',
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime())
    };
  }

  @Public()
  @Get('health')
  async getHealth() {
    const startedAt = Date.now();
    const database = await this.checkDatabase();
    const redis = await this.checkRedis();

    return {
      status: database.status === 'up' && redis.status === 'up' ? 'healthy' : 'degraded',
      uptimeSeconds: Math.round(process.uptime()),
      durationMs: Date.now() - startedAt,
      checks: {
        database,
        redis
      }
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up' as const };
    } catch (error) {
      return {
        status: 'down' as const,
        message: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  private async checkRedis() {
    try {
      const pong = await this.redis.ping();
      return { status: pong === 'PONG' ? ('up' as const) : ('down' as const), ping: pong };
    } catch (error) {
      return {
        status: 'down' as const,
        message: error instanceof Error ? error.message : 'Unknown redis error'
      };
    }
  }
}
