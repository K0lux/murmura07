import { afterEach, describe, expect, it } from 'vitest';
import { createApiGatewayTestApp } from '../helpers/test-app.js';

describe('HTTP smoke E2E', () => {
  let activeApp: Awaited<ReturnType<typeof createApiGatewayTestApp>>['app'] | undefined;

  afterEach(async () => {
    await activeApp?.close();
    activeApp = undefined;
  });

  it('serves health and slash command flows through the HTTP layer', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const healthResponse = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(healthResponse.statusCode).toBe(200);
    expect(healthResponse.json()).toMatchObject({
      data: {
        status: 'healthy',
        checks: {
          database: { status: 'up' },
          redis: { status: 'up', ping: 'PONG' }
        }
      }
    });

    const suggestionsResponse = await app.inject({
      method: 'GET',
      url: '/v1/slash-commands/suggestions?threadId=thread-1',
      headers: {
        authorization: 'Bearer valid-access-token'
      }
    });

    expect(suggestionsResponse.statusCode).toBe(200);
    expect(suggestionsResponse.json()).toMatchObject({
      data: {
        threadId: 'thread-1',
        suggestions: ['/analyse', '/resume']
      }
    });

    const executeResponse = await app.inject({
      method: 'POST',
      url: '/v1/slash-commands/execute',
      headers: {
        authorization: 'Bearer valid-access-token'
      },
      payload: {
        command: '/analyse',
        inputText: 'Analyse ce message'
      }
    });

    expect(executeResponse.statusCode).toBe(201);
    expect(executeResponse.json()).toMatchObject({
      data: {
        command: '/analyse',
        inputText: 'Analyse ce message',
        userId: 'user-1'
      }
    });
  });
});
