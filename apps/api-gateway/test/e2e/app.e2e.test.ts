import 'reflect-metadata';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Body, Controller, Get, Module, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import { AppController } from '../../src/app.controller.js';
import { Public } from '../../src/common/decorators/public.decorator.js';
import { PrismaService } from '../../src/infrastructure/database/prisma.service.js';
import { RedisService } from '../../src/infrastructure/redis/redis.service.js';
import { AuthController } from '../../src/modules/auth/auth.controller.js';
import { AuthService } from '../../src/modules/auth/auth.service.js';

const runContainerE2E = process.env.RUN_INTEGRATION === '1';
const describeContainerE2E = runContainerE2E ? describe : describe.skip;

describeContainerE2E('API Gateway E2E', () => {
  let postgres: StartedTestContainer | undefined;
  let redis: StartedTestContainer | undefined;
  let app: NestFastifyApplication | undefined;

  beforeAll(async () => {
    postgres = await new GenericContainer('postgres:16-alpine')
      .withEnvironment({
        POSTGRES_USER: 'murmura',
        POSTGRES_PASSWORD: 'murmura',
        POSTGRES_DB: 'murmura_e2e'
      })
      .withExposedPorts(5432)
      .start();

    redis = await new GenericContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();

    process.env.DATABASE_URL =
      `postgresql://murmura:murmura@${postgres.getHost()}:${postgres.getMappedPort(5432)}` +
      '/murmura_e2e?schema=public';
    process.env.REDIS_URL = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;
    process.env.JWT_ACCESS_SECRET = 'e2e_access_secret';
    process.env.JWT_REFRESH_SECRET = 'e2e_refresh_secret';
    process.env.JWT_ACCESS_TTL = '15m';
    process.env.JWT_REFRESH_TTL = '30d';
    process.env.NODE_ENV = 'test';

    const appRoot = process.cwd();
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

    const appController = new AppController(new PrismaService(), new RedisService());
    const authController = new AuthController(new AuthService(new PrismaService(), new RedisService()));

    @Controller()
    class TestAppController {
      @Public()
      @Get()
      getRoot() {
        return appController.getRoot();
      }

      @Public()
      @Get('health')
      getHealth() {
        return appController.getHealth();
      }
    }

    @Controller('auth')
    class TestAuthController {
      @Public()
      @Post('register')
      register(@Body() body: Record<string, string>) {
        return authController.register(body as never);
      }

      @Public()
      @Post('login')
      login(@Body() body: Record<string, string>) {
        return authController.login(body as never);
      }

      @Public()
      @Post('refresh')
      refresh(@Body() body: { refreshToken: string }) {
        return authController.refresh(body);
      }

      @Post('logout')
      logout(@Body() body: { refreshToken: string }) {
        return authController.logout(body);
      }
    }

    @Module({
      controllers: [TestAppController, TestAuthController]
    })
    class ContainerE2ETestModule {}

    app = await NestFactory.create<NestFastifyApplication>(
      ContainerE2ETestModule,
      new FastifyAdapter(),
      { logger: ['error'] }
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  }, 180000);

  afterAll(async () => {
    await app?.close();
    await redis?.stop();
    await postgres?.stop();
  });

  it('runs the containerized auth lifecycle end to end', async () => {
    expect(app).toBeDefined();
    if (!app) {
      return;
    }

    const health = await app.inject({
      method: 'GET',
      url: '/health'
    });
    expect(health.statusCode).toBe(200);

    const email = `e2e_${Date.now()}@example.com`;
    const password = 'P@ssword123';

    const registerResponse = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email,
        password
      }
    });
    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email,
        password
      }
    });
    expect(loginResponse.statusCode).toBe(201);

    const loginBody = loginResponse.json() as {
      accessToken: string;
      refreshToken: string;
    };

    expect(loginBody.accessToken).toBeTruthy();
    expect(loginBody.refreshToken).toBeTruthy();

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

    expect(refreshBody.accessToken).toBeTruthy();
    expect(refreshBody.refreshToken).toBeTruthy();
    expect(refreshBody.refreshToken).not.toBe(loginBody.refreshToken);

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      payload: {
        refreshToken: refreshBody.refreshToken
      }
    });
    expect(logoutResponse.statusCode).toBe(201);
    expect(logoutResponse.json()).toEqual({ loggedOut: true });

    const reusedRefresh = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: {
        refreshToken: refreshBody.refreshToken
      }
    });
    expect(reusedRefresh.statusCode).toBe(401);
  }, 180000);
});
