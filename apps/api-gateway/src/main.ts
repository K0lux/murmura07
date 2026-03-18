import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.use((req: { headers: Record<string, string> }, _res: unknown, next: () => void) => {
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = `req_${Date.now()}`;
    }
    next();
  });

  await app.listen(3000, '0.0.0.0');
}

void bootstrap();

