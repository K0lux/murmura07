import fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { authPlugin } from './plugins/auth.plugin.js';
import { opentelemetryPlugin } from './plugins/opentelemetry.plugin.js';
import { rateLimitPlugin } from './plugins/rate-limit.plugin.js';
import { swaggerPlugin } from './plugins/swagger.plugin.js';
import { validationPlugin } from './plugins/validation.plugin.js';
import { analyzeRoute } from './routes/analyze.route.js';
import { memoryRoute } from './routes/memory.route.js';
import { identityRoute } from './routes/identity.route.js';
import { relationshipsRoute } from './routes/relationships.route.js';
import { governanceRoute } from './routes/governance.route.js';
import { contextRoute } from './routes/context.route.js';
import { healthRoute } from './routes/health.route.js';
import { requestIdMiddleware } from './middleware/request.id.middleware.js';
import { performanceMiddleware } from './middleware/performance.middleware.js';

export function buildServer() {
  const app = fastify({ logger: process.env.NODE_ENV !== 'test' });

  app.register(helmet);
  app.register(cors, { origin: true });
  app.register(opentelemetryPlugin);
  app.register(swaggerPlugin);

  app.addHook('onRequest', requestIdMiddleware);
  app.addHook('onRequest', performanceMiddleware);

  app.register(authPlugin);
  app.register(rateLimitPlugin);
  app.register(validationPlugin);

  app.register(analyzeRoute, { prefix: '/v1/analyze' });
  app.register(memoryRoute, { prefix: '/v1/memory' });
  app.register(identityRoute, { prefix: '/v1/identity' });
  app.register(relationshipsRoute, { prefix: '/v1/relationships' });
  app.register(governanceRoute, { prefix: '/v1/governance' });
  app.register(contextRoute, { prefix: '/v1/context' });
  app.register(healthRoute, { prefix: '/v1/health' });

  return app;
}

