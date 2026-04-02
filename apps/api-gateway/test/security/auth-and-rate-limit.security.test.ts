import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApiGatewayTestApp } from '../helpers/test-app.js';

describe('Security protections', () => {
  let activeApp: Awaited<ReturnType<typeof createApiGatewayTestApp>>['app'] | undefined;

  afterEach(async () => {
    await activeApp?.close();
    activeApp = undefined;
  });

  it('rejects malformed bearer tokens on protected routes', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'GET',
      url: '/v1/slash-commands/suggestions',
      headers: {
        authorization: 'Bearer invalid-token',
        'x-request-id': 'req_invalid_token'
      }
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        statusCode: 401,
        message: 'Invalid token'
      }
    });
  });

  it('rejects missing bearer tokens on protected routes', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'GET',
      url: '/v1/slash-commands/suggestions',
      headers: {
        'x-request-id': 'req_missing_token'
      }
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        statusCode: 401,
        message: 'Missing Authorization header'
      }
    });
  });

  it('rejects invalid analyze payloads instead of crashing', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'POST',
      url: '/v1/analyze',
      headers: {
        authorization: 'Bearer valid-access-token'
      },
      payload: {
        content: '',
        canal: '',
        interlocuteurId: ''
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        statusCode: 400
      }
    });
  });

  it('rejects malformed slash execute payloads with a client error contract', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const response = await app.inject({
      method: 'POST',
      url: '/v1/slash-commands/execute',
      headers: {
        authorization: 'Bearer valid-access-token'
      },
      payload: {
        command: '',
        context: {
          threadId: ''
        }
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        statusCode: 400
      }
    });
  });

  it('throttles analyze calls when the per-user quota is exceeded', async () => {
    const { app } = await createApiGatewayTestApp({
      env: {
        RATE_LIMIT_GLOBAL_PER_MIN: '20',
        RATE_LIMIT_USER_PER_MIN: '20',
        RATE_LIMIT_ANALYZE_PER_MIN: '1',
        RATE_LIMIT_USER_DAILY: '5'
      }
    });
    activeApp = app;

    const request = {
      method: 'POST' as const,
      url: '/v1/analyze',
      headers: {
        authorization: 'Bearer valid-access-token'
      },
      payload: {
        content: 'hello',
        canal: 'slack',
        interlocuteurId: 'contact-1'
      }
    };

    const first = await app.inject(request);
    const second = await app.inject(request);

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(429);
    expect(second.json()).toMatchObject({
      error: {
        statusCode: 429,
        message: 'Rate limit exceeded'
      }
    });
  });

  it('enforces the daily analyze quota with a controlled 429 response', async () => {
    const { app } = await createApiGatewayTestApp({
      env: {
        RATE_LIMIT_GLOBAL_PER_MIN: '20',
        RATE_LIMIT_USER_PER_MIN: '20',
        RATE_LIMIT_ANALYZE_PER_MIN: '20',
        RATE_LIMIT_USER_DAILY: '1'
      }
    });
    activeApp = app;

    const request = {
      method: 'POST' as const,
      url: '/v1/analyze',
      headers: {
        authorization: 'Bearer valid-access-token'
      },
      payload: {
        content: 'hello',
        canal: 'slack',
        interlocuteurId: 'contact-1'
      }
    };

    const first = await app.inject(request);
    const second = await app.inject(request);

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(429);
    expect(second.json()).toMatchObject({
      error: {
        statusCode: 429,
        message: 'Daily quota exceeded'
      }
    });
  });

  it('surfaces OTP resend failures through the global error contract', async () => {
    const requestPhoneVerificationOtp = vi
      .fn()
      .mockResolvedValueOnce({
        phoneNumber: '+22890123456',
        expiresInSeconds: 600,
        resendAvailableInSeconds: 60,
        otp: '123456'
      })
      .mockRejectedValueOnce(new Error('Please wait 60s before requesting another OTP'));

    const { app } = await createApiGatewayTestApp({
      authService: {
        requestPhoneVerificationOtp
      }
    });
    activeApp = app;

    const headers = {
      authorization: 'Bearer valid-access-token'
    };

    const first = await app.inject({
      method: 'POST',
      url: '/auth/phone/request-otp',
      headers,
      payload: {
        phoneNumber: '+22890123456'
      }
    });

    const second = await app.inject({
      method: 'POST',
      url: '/auth/phone/request-otp',
      headers,
      payload: {
        phoneNumber: '+22890123456'
      }
    });

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(500);
    expect(second.json()).toMatchObject({
      error: {
        statusCode: 500,
        path: '/auth/phone/request-otp'
      }
    });
  });
});
