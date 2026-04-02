import 'reflect-metadata';
import { Body, Controller, Get, Module, Post, Query, Req } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { z } from 'zod';
import { vi } from 'vitest';
import { AppController } from '../../src/app.controller.js';
import { Public } from '../../src/common/decorators/public.decorator.js';
import { GlobalExceptionFilter } from '../../src/common/filters/global-exception.filter.js';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard.js';
import { RateLimitGuard } from '../../src/common/guards/rate-limit.guard.js';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor.js';
import { ZodValidationPipe } from '../../src/common/pipes/zod-validation.pipe.js';
import { PrismaService } from '../../src/infrastructure/database/prisma.service.js';
import { RedisService } from '../../src/infrastructure/redis/redis.service.js';
import { AuthController } from '../../src/modules/auth/auth.controller.js';
import { AuthService } from '../../src/modules/auth/auth.service.js';
import { AnalyzeController } from '../../src/modules/cognitive/analyze/analyze.controller.js';
import { CognitiveService } from '../../src/modules/cognitive/cognitive.service.js';
import { SlashCommandsController } from '../../src/modules/slash-commands/slash-commands.controller.js';
import { SlashCommandsService } from '../../src/modules/slash-commands/slash-commands.service.js';

type RedisState = {
  counters: Map<string, number>;
  expirations: Map<string, number>;
};

export type TestAppMocks = {
  authService: ReturnType<typeof createAuthServiceMock>;
  cognitiveService: ReturnType<typeof createCognitiveServiceMock>;
  slashCommandsService: ReturnType<typeof createSlashCommandsServiceMock>;
  prismaService: ReturnType<typeof createPrismaServiceMock>;
  redisService: ReturnType<typeof createRedisServiceMock>;
};

type CreateTestAppOptions = {
  authService?: Partial<TestAppMocks['authService']>;
  cognitiveService?: Partial<TestAppMocks['cognitiveService']>;
  slashCommandsService?: Partial<TestAppMocks['slashCommandsService']>;
  prismaService?: Partial<TestAppMocks['prismaService']>;
  redisService?: Partial<TestAppMocks['redisService']>;
  env?: Record<string, string>;
};

function createPrismaServiceMock() {
  return {
    $queryRaw: vi.fn(async () => [{ '?column?': 1 }])
  };
}

function createRedisServiceMock() {
  const state: RedisState = {
    counters: new Map(),
    expirations: new Map()
  };

  return {
    state,
    get: vi.fn(async () => null),
    set: vi.fn(async () => 'OK'),
    incr: vi.fn(async (key: string) => {
      const next = (state.counters.get(key) ?? 0) + 1;
      state.counters.set(key, next);
      return next;
    }),
    expire: vi.fn(async (key: string, ttlSeconds: number) => {
      state.expirations.set(key, ttlSeconds);
      return 1;
    }),
    ttl: vi.fn(async () => -1),
    ping: vi.fn(async () => 'PONG'),
    del: vi.fn(async () => 1)
  };
}

function createAuthServiceMock() {
  return {
    register: vi.fn(async (email: string) => ({ id: 'user-1', email })),
    login: vi.fn(async () => ({
      accessToken: 'valid-access-token',
      refreshToken: 'refresh-token-1'
    })),
    refresh: vi.fn(async () => ({
      accessToken: 'valid-access-token-2',
      refreshToken: 'refresh-token-2'
    })),
    logout: vi.fn(async () => ({ loggedOut: true })),
    requestPhoneVerificationOtp: vi.fn(async (_userId: string, phoneNumber: string) => ({
      phoneNumber,
      expiresInSeconds: 600,
      resendAvailableInSeconds: 60,
      otp: '123456'
    })),
    verifyPhoneOtp: vi.fn(async (_userId: string, phoneNumber: string, otp: string) => ({
      verified: true,
      user: {
        id: 'user-1',
        email: 'user@example.com',
        phoneNumber,
        otp
      }
    })),
    verifyAccessToken: vi.fn((token: string) => {
      if (token !== 'valid-access-token' && token !== 'valid-access-token-2') {
        throw new Error('Invalid token');
      }
      return { sub: 'user-1', type: 'access' };
    })
  };
}

function createCognitiveServiceMock() {
  return {
    analyze: vi.fn(async (requestId: string, payload: unknown) => ({
      requestId,
      payload
    }))
  };
}

function createSlashCommandsServiceMock() {
  return {
    execute: vi.fn(async (command: string, inputText: string, userId: string, context?: unknown) => ({
      command,
      inputText,
      userId,
      context
    })),
    getSuggestions: vi.fn(async (threadId: string | undefined, userId: string) => ({
      threadId,
      userId,
      suggestions: ['/analyse', '/resume']
    }))
  };
}

export async function createApiGatewayTestApp(options: CreateTestAppOptions = {}) {
  for (const [key, value] of Object.entries({
    RATE_LIMIT_GLOBAL_PER_MIN: '50',
    RATE_LIMIT_USER_PER_MIN: '50',
    RATE_LIMIT_ANALYZE_PER_MIN: '50',
    RATE_LIMIT_USER_DAILY: '500',
    ...options.env
  })) {
    process.env[key] = value;
  }

  const prismaService = Object.assign(createPrismaServiceMock(), options.prismaService);
  const redisService = Object.assign(createRedisServiceMock(), options.redisService);
  const authService = Object.assign(createAuthServiceMock(), options.authService);
  const cognitiveService = Object.assign(createCognitiveServiceMock(), options.cognitiveService);
  const slashCommandsService = Object.assign(
    createSlashCommandsServiceMock(),
    options.slashCommandsService
  );
  const appController = new AppController(prismaService as never, redisService as never);
  const authController = new AuthController(authService as never);
  const analyzeController = new AnalyzeController(cognitiveService as never);
  const slashCommandsController = new SlashCommandsController(slashCommandsService as never);

  const AnalyzeRequestSchema = z.object({
    content: z.string().min(1),
    canal: z.string().min(1),
    interlocuteurId: z.string().min(1),
    threadId: z.string().optional(),
    urgencyFlag: z.boolean().optional()
  });

  const ExecuteSlashCommandSchema = z.object({
    command: z.string().min(1),
    inputText: z.string().default(''),
    context: z
      .object({
        incomingMessage: z.string().min(1).optional(),
        threadId: z.string().min(1).optional(),
        tone: z.string().min(1).optional(),
        targetLanguage: z.string().min(2).optional()
      })
      .optional()
  });

  const SuggestionQuerySchema = z.object({
    threadId: z.string().min(1).optional()
  });

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

    @Post('phone/request-otp')
    requestPhoneOtp(
      @Req() req: { user?: { userId: string } },
      @Body() body: { phoneNumber: string }
    ) {
      return authController.requestPhoneOtp({ userId: req.user?.userId ?? 'anonymous' }, body as never);
    }

    @Post('phone/verify-otp')
    verifyPhoneOtp(
      @Req() req: { user?: { userId: string } },
      @Body() body: { phoneNumber: string; otp: string }
    ) {
      return authController.verifyPhoneOtp({ userId: req.user?.userId ?? 'anonymous' }, body as never);
    }
  }

  @Controller('v1/analyze')
  class TestAnalyzeController {
    @Post()
    analyze(
      @Body(new ZodValidationPipe(AnalyzeRequestSchema))
      body: z.infer<typeof AnalyzeRequestSchema>,
      @Req() req: { headers: Record<string, string>; user?: { userId: string } }
    ) {
      return analyzeController.analyze(body, req);
    }
  }

  @Controller('v1/slash-commands')
  class TestSlashCommandsController {
    @Post('execute')
    execute(
      @Req() req: { user?: { userId: string } },
      @Body(new ZodValidationPipe(ExecuteSlashCommandSchema))
      body: z.infer<typeof ExecuteSlashCommandSchema>
    ) {
      return slashCommandsController.execute(req, body);
    }

    @Get('suggestions')
    suggestions(
      @Req() req: { user?: { userId: string } },
      @Query(new ZodValidationPipe(SuggestionQuerySchema))
      query: z.infer<typeof SuggestionQuerySchema>
    ) {
      return slashCommandsController.suggestions(req, query);
    }
  }

  @Module({
    controllers: [
      TestAppController,
      TestAuthController,
      TestAnalyzeController,
      TestSlashCommandsController
    ],
    providers: [
      { provide: PrismaService, useValue: prismaService },
      { provide: RedisService, useValue: redisService },
      { provide: AuthService, useValue: authService },
      { provide: CognitiveService, useValue: cognitiveService },
      { provide: SlashCommandsService, useValue: slashCommandsService }
    ]
  })
  class TestApiGatewayModule {}

  const app = await NestFactory.create<NestFastifyApplication>(
    TestApiGatewayModule,
    new FastifyAdapter(),
    { logger: false }
  );
  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    new JwtAuthGuard(reflector, authService as never),
    new RateLimitGuard(redisService as never, reflector)
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return {
    app,
    mocks: {
      authService,
      cognitiveService,
      slashCommandsService,
      prismaService,
      redisService
    }
  };
}
