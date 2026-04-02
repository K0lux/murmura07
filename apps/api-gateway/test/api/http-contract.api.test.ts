import { afterEach, describe, expect, it } from 'vitest';
import { createApiGatewayTestApp } from '../helpers/test-app.js';

describe('API HTTP contracts', () => {
  let activeApp: Awaited<ReturnType<typeof createApiGatewayTestApp>>['app'] | undefined;

  afterEach(async () => {
    await activeApp?.close();
    activeApp = undefined;
  });

  it('wraps successful public responses with request metadata', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        'x-request-id': 'req_root_1'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      requestId: 'req_root_1',
      data: {
        name: 'Murmura API Gateway',
        status: 'ok'
      }
    });
  });

  it('returns health details for infrastructure checks', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      data: {
        status: 'healthy',
        checks: {
          database: { status: 'up' },
          redis: { status: 'up', ping: 'PONG' }
        }
      }
    });
  });

  it('enforces auth on protected endpoints and preserves the error contract', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'GET',
      url: '/v1/slash-commands/suggestions',
      headers: {
        'x-request-id': 'req_missing_auth'
      }
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      requestId: 'req_missing_auth',
      error: {
        statusCode: 401,
        message: 'Missing Authorization header',
        method: 'GET',
        path: '/v1/slash-commands/suggestions'
      }
    });
  });

  it('validates request payloads before reaching the cognitive pipeline', async () => {
    const { app, mocks } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'POST',
      url: '/v1/analyze',
      headers: {
        authorization: 'Bearer valid-access-token',
        'x-request-id': 'req_analyze_invalid'
      },
      payload: {
        content: '',
        canal: '',
        interlocuteurId: ''
      }
    });

    expect(response.statusCode).toBe(400);
    expect(mocks.cognitiveService.analyze).not.toHaveBeenCalled();
    expect(response.json()).toMatchObject({
      requestId: 'req_analyze_invalid',
      error: {
        statusCode: 400,
        path: '/v1/analyze',
        method: 'POST'
      }
    });
  });

  it('routes authenticated slash-command requests with the expected user context', async () => {
    const { app, mocks } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'POST',
      url: '/v1/slash-commands/execute',
      headers: {
        authorization: 'Bearer valid-access-token'
      },
      payload: {
        command: '/resume',
        inputText: 'Bonjour',
        context: {
          threadId: 'thread-1'
        }
      }
    });

    expect(response.statusCode).toBe(201);
    expect(mocks.slashCommandsService.execute).toHaveBeenCalledWith(
      '/resume',
      'Bonjour',
      'user-1',
      { threadId: 'thread-1' }
    );
    expect(response.json()).toMatchObject({
      data: {
        command: '/resume',
        userId: 'user-1'
      }
    });
  });
});
