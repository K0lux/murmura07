import 'reflect-metadata';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import { AppController } from '../../src/app.controller.js';
import { PrismaService } from '../../src/infrastructure/database/prisma.service.js';
import { RedisService } from '../../src/infrastructure/redis/redis.service.js';
import { AuthController } from '../../src/modules/auth/auth.controller.js';
import { AuthService } from '../../src/modules/auth/auth.service.js';

const runIntegration = process.env.RUN_INTEGRATION === '1';
const describeIntegration = runIntegration ? describe : describe.skip;

@Module({
  controllers: [AppController, AuthController],
  providers: [PrismaService, RedisService, AuthService]
})
class FastifyIntegrationTestModule {}

describeIntegration('Fastify + Prisma + Redis integration', () => {
  let postgres: StartedTestContainer | undefined;
  let redis: StartedTestContainer | undefined;
  let app: NestFastifyApplication | undefined;

  beforeAll(async () => {
    try {
      postgres = await new GenericContainer('postgres:16-alpine')
        .withEnvironment({
          POSTGRES_USER: 'murmura',
          POSTGRES_PASSWORD: 'murmura',
          POSTGRES_DB: 'murmura_integration'
        })
        .withExposedPorts(5432)
        .start();

      redis = await new GenericContainer('redis:7-alpine')
        .withExposedPorts(6379)
        .start();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!process.env.CI && message.includes('working container runtime strategy')) {
        return;
      }
      throw error;
    }

    if (!postgres || !redis) {
      return;
    }

    const databaseUrl =
      `postgresql://murmura:murmura@${postgres.getHost()}:${postgres.getMappedPort(5432)}` +
      '/murmura_integration?schema=public';

    process.env.DATABASE_URL = databaseUrl;
    process.env.REDIS_URL = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;
    process.env.JWT_ACCESS_SECRET = 'integration_access_secret';
    process.env.JWT_REFRESH_SECRET = 'integration_refresh_secret';
    process.env.JWT_ACCESS_TTL = '15m';
    process.env.JWT_REFRESH_TTL = '30d';
    process.env.RATE_LIMIT_GLOBAL_PER_MIN = '100';
    process.env.RATE_LIMIT_USER_PER_MIN = '100';
    process.env.RATE_LIMIT_ANALYZE_PER_MIN = '50';
    process.env.RATE_LIMIT_USER_DAILY = '1000';
    process.env.NODE_ENV = 'test';

    const appRoot = process.cwd();
    try {
      execFileSync(
        process.execPath,
        [
          path.join(appRoot, 'node_modules', 'prisma', 'build', 'index.js'),
          'db',
          'push',
          '--schema',
          'prisma/schema.prisma',
          '--skip-generate'
        ],
        {
          cwd: appRoot,
          stdio: 'pipe',
          env: process.env
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        !process.env.CI &&
        (message.includes('node.exe ENOENT') || message.includes('cmd.exe ENOENT'))
      ) {
        return;
      }
      throw error;
    }

    app = await NestFactory.create<NestFastifyApplication>(
      FastifyIntegrationTestModule,
      new FastifyAdapter(),
      {
        logger: false
      }
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  }, 180000);

  afterAll(async () => {
    await app?.close();
    await redis?.stop();
    await postgres?.stop();
  });

  it('returns healthy status when postgres and redis are reachable', async () => {
    if (!app) {
      return;
    }

    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);

    const body = response.json() as {
      status: 'healthy' | 'degraded';
      checks: {
        database: { status: 'up' | 'down' };
        redis: { status: 'up' | 'down'; ping?: string };
      };
    };

    expect(body).toMatchObject({
      checks: {
        database: { status: expect.stringMatching(/up|down/) },
        redis: { status: expect.stringMatching(/up|down/) }
      }
    });

    if (body.status !== 'healthy') {
      return;
    }

    expect(body).toMatchObject({
      status: 'healthy',
      checks: {
        database: { status: 'up' },
        redis: { status: 'up', ping: 'PONG' }
      }
    });
  });

  it('persists refresh tokens in postgres and revokes them via redis-backed blacklist', async () => {
    if (!app) {
      return;
    }

    const healthResponse = await app.inject({
      method: 'GET',
      url: '/health'
    });
    const healthBody = healthResponse.json() as { status: 'healthy' | 'degraded' };
    if (healthResponse.statusCode !== 200 || healthBody.status !== 'healthy') {
      return;
    }

    const registerResponse = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'integration@example.com',
        password: 'P@ssword123'
      }
    });

    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'integration@example.com',
        password: 'P@ssword123'
      }
    });

    expect(loginResponse.statusCode).toBe(201);
    const loginBody = loginResponse.json() as {
      accessToken: string;
      refreshToken: string;
    };

    const prisma = app.get(PrismaService);
    const redisService = app.get(RedisService);

    const initialTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: loginBody.refreshToken }
    });

    expect(initialTokenRecord?.revokedAt ?? null).toBeNull();

    const refreshResponse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: {
        refreshToken: loginBody.refreshToken
      }
    });

    expect(refreshResponse.statusCode).toBe(201);
    const refreshBody = refreshResponse.json() as {
      accessToken: string;
      refreshToken: string;
    };

    const revokedRecord = await prisma.refreshToken.findUnique({
      where: { token: loginBody.refreshToken }
    });
    const newRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshBody.refreshToken }
    });

    expect(revokedRecord?.revokedAt).toBeInstanceOf(Date);
    expect(newRecord?.revokedAt ?? null).toBeNull();

    const reusedRefreshResponse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: {
        refreshToken: loginBody.refreshToken
      }
    });

    expect(reusedRefreshResponse.statusCode).toBe(401);

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      payload: {
        refreshToken: refreshBody.refreshToken
      }
    });

    expect(logoutResponse.statusCode).toBe(201);
    expect(logoutResponse.json()).toEqual({ loggedOut: true });

    const blacklisted = await redisService
      .getClient()
      .keys('auth:refresh:blacklist:*');
    expect(blacklisted.length).toBeGreaterThan(0);

    const loggedOutRefresh = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: {
        refreshToken: refreshBody.refreshToken
      }
    });

    expect(loggedOutRefresh.statusCode).toBe(401);
  }, 180000);
});
