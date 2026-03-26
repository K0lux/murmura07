import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Fastify from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@murmura/cognitive-core-ingestion', () => ({
  IngestionPipeline: class {
    async process(input: { canal: string; interlocuteurId: string; content: string; userId: string }) {
      return {
        intention: 'request',
        emotion: {
          dominant: 'neutral',
          intensity: 0.2
        },
        powerAsymmetry: {
          direction: 'balanced',
          intensity: 0.1
        },
        explicitDemand: input.content,
        implicitDemand: undefined,
        urgencyLevel: 'medium',
        tensionScore: 0.2,
        ambiguityScore: 0.1
      };
    }
  }
}));

vi.mock('../orchestrator/pipeline.orchestrator.js', () => ({
  PipelineOrchestrator: class {
    async run(input: { requestId: string; recommendation: { strategy: string } }) {
      return {
        id: 'decision_mock',
        requestId: input.requestId,
        timestamp: new Date('2026-03-18T00:00:00.000Z'),
        selectedStrategy: input.recommendation.strategy,
        suggestedReply: 'Je confirme.',
        alternativeReplies: [],
        alerts: [],
        autonomyAllowed: false,
        requiresValidation: true,
        explanation: 'mocked explanation',
        confidence: 0.77,
        simulations: []
      };
    }
  }
}));

vi.mock('@murmura/cognitive-core-decision-engine', () => ({
  DecisionOrchestrationAgent: class {}
}));

vi.mock('@murmura/cognitive-core-memory', async () => {
  const actual = await vi.importActual<typeof import('@murmura/cognitive-core-memory')>(
    '@murmura/cognitive-core-memory'
  );

  return {
    ...actual,
    MemorySearchEngine: class {
      async search(_userId: string, query: string) {
        return [
          {
            snippet: `result for ${query}`,
            source: 'MEMORY.md',
            lineRange: [1, 2],
            score: 0.91,
            sourceType: 'memory'
          }
        ];
      }
    }
  };
});

import { authPlugin } from '../plugins/auth.plugin.js';
import { validationPlugin } from '../plugins/validation.plugin.js';
import { analyzeRoute } from '../routes/analyze.route.js';
import { contextRoute } from '../routes/context.route.js';
import { governanceRoute } from '../routes/governance.route.js';
import { healthRoute } from '../routes/health.route.js';
import { identityRoute } from '../routes/identity.route.js';
import { memoryRoute } from '../routes/memory.route.js';
import { relationshipsRoute } from '../routes/relationships.route.js';

const originalWorkspaceRoot = process.env.MURMURA_WORKSPACE_DIR;
const originalJwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const originalJwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

let workspaceRoot: string;

beforeEach(async () => {
  workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'murmura-route-tests-'));
  process.env.MURMURA_WORKSPACE_DIR = workspaceRoot;
  process.env.JWT_ACCESS_SECRET = 'route_access_secret';
  process.env.JWT_REFRESH_SECRET = 'route_refresh_secret';
});

afterEach(async () => {
  await fs.rm(workspaceRoot, { recursive: true, force: true });

  if (originalWorkspaceRoot === undefined) {
    delete process.env.MURMURA_WORKSPACE_DIR;
  } else {
    process.env.MURMURA_WORKSPACE_DIR = originalWorkspaceRoot;
  }

  if (originalJwtAccessSecret === undefined) {
    delete process.env.JWT_ACCESS_SECRET;
  } else {
    process.env.JWT_ACCESS_SECRET = originalJwtAccessSecret;
  }

  if (originalJwtRefreshSecret === undefined) {
    delete process.env.JWT_REFRESH_SECRET;
  } else {
    process.env.JWT_REFRESH_SECRET = originalJwtRefreshSecret;
  }
});

async function buildRouteTestApp() {
  const app = Fastify();
  await app.register(authPlugin);
  await app.register(validationPlugin);
  await app.register(analyzeRoute, { prefix: '/v1/analyze' });
  await app.register(memoryRoute, { prefix: '/v1/memory' });
  await app.register(contextRoute, { prefix: '/v1/context' });
  await app.register(relationshipsRoute, { prefix: '/v1/relationships' });
  await app.register(identityRoute, { prefix: '/v1/identity' });
  await app.register(governanceRoute, { prefix: '/v1/governance' });
  await app.register(healthRoute, { prefix: '/v1/health' });
  app.get('/v1/health/test-token', async (_request, reply) =>
    reply.issueTokens({ userId: 'user-api' })
  );
  await app.ready();
  return app;
}

async function issueAccessToken(app: Awaited<ReturnType<typeof buildRouteTestApp>>) {
  const response = await app.inject({ method: 'GET', url: '/v1/health/test-token' });
  return (response.json() as { accessToken: string }).accessToken;
}

describe('API routes', () => {
  it('serves the public health route without authentication', async () => {
    const app = await buildRouteTestApp();

    const response = await app.inject({ method: 'GET', url: '/v1/health/' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
      checks: {
        api: { status: 'up' },
        authConfig: { status: 'up' },
        workspaceTemplate: { status: 'up' }
      }
    });

    await app.close();
  });

  it('reports degraded health when a dependency check fails', async () => {
    const app = Fastify();
    await app.register(healthRoute, {
      prefix: '/v1/health',
      checks: {
        database: async () => ({ status: 'up' }),
        redis: async () => ({ status: 'down', message: 'redis unavailable' })
      }
    });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/v1/health/' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'degraded',
      checks: {
        database: { status: 'up' },
        redis: { status: 'down', message: 'redis unavailable' }
      }
    });

    await app.close();
  });

  it('rejects analyze requests without a bearer token', async () => {
    const app = await buildRouteTestApp();

    const response = await app.inject({
      method: 'POST',
      url: '/v1/analyze/',
      payload: {
        content: 'Peux-tu confirmer la reunion ?',
        canal: 'email',
        interlocuteurId: 'contact-1'
      }
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: 'Missing Authorization header' });

    await app.close();
  });

  it('processes analyze requests with validation and auth enabled', async () => {
    const app = await buildRouteTestApp();
    const accessToken = await issueAccessToken(app);

    const success = await app.inject({
      method: 'POST',
      url: '/v1/analyze/',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'x-request-id': 'req-analyze'
      },
      payload: {
        content: 'Peux-tu me confirmer si le contrat est pret ?',
        canal: 'email',
        interlocuteurId: 'contact-1'
      }
    });

    const invalid = await app.inject({
      method: 'POST',
      url: '/v1/analyze/',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'x-request-id': 'req-invalid'
      },
      payload: {
        content: '',
        canal: 'fax',
        interlocuteurId: ''
      }
    });

    expect(success.statusCode).toBe(200);
    expect(success.json()).toMatchObject({
      requestId: 'req-analyze',
      recommendation: {
        strategy: 'respond_direct',
        suggestedReply: 'Je confirme.'
      }
    });
    expect(invalid.statusCode).toBe(400);
    expect((invalid.json() as { error: string }).error).toBe('VALIDATION_ERROR');

    await app.close();
  });

  it('serves authenticated memory, context, identity, governance and relationships routes', async () => {
    const app = await buildRouteTestApp();
    const accessToken = await issueAccessToken(app);

    const memoryResponse = await app.inject({
      method: 'GET',
      url: '/v1/memory/search?query=alpha',
      headers: { authorization: `Bearer ${accessToken}` }
    });
    const contextResponse = await app.inject({
      method: 'GET',
      url: '/v1/context/session-123',
      headers: { authorization: `Bearer ${accessToken}` }
    });
    const relationshipsResponse = await app.inject({
      method: 'GET',
      url: '/v1/relationships/',
      headers: { authorization: `Bearer ${accessToken}` }
    });
    const identityResponse = await app.inject({
      method: 'GET',
      url: '/v1/identity/',
      headers: { authorization: `Bearer ${accessToken}` }
    });
    const governanceResponse = await app.inject({
      method: 'GET',
      url: '/v1/governance/rules',
      headers: { authorization: `Bearer ${accessToken}` }
    });

    expect(memoryResponse.statusCode).toBe(200);
    expect(memoryResponse.json()).toEqual([
      {
        snippet: 'result for alpha',
        source: 'MEMORY.md',
        lineRange: [1, 2],
        score: 0.91,
        sourceType: 'memory'
      }
    ]);
    expect(contextResponse.statusCode).toBe(200);
    expect(contextResponse.json()).toEqual({ sessionId: 'session-123' });
    expect(relationshipsResponse.statusCode).toBe(200);
    expect(relationshipsResponse.json()).toEqual({ items: [] });
    expect(identityResponse.statusCode).toBe(200);
    expect(identityResponse.json()).toEqual({ status: 'ok' });
    expect(governanceResponse.statusCode).toBe(200);
    expect(governanceResponse.json()).toEqual({ rules: [] });

    await app.close();
  });
});
