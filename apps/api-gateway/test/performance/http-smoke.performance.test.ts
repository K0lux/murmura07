import { afterEach, describe, expect, it } from 'vitest';
import { createApiGatewayTestApp } from '../helpers/test-app.js';

describe('Performance smoke', () => {
  let activeApp: Awaited<ReturnType<typeof createApiGatewayTestApp>>['app'] | undefined;
  const runLoad = process.env['RUN_LOAD'] === '1';
  const runStress = process.env['RUN_STRESS'] === '1';

  afterEach(async () => {
    await activeApp?.close();
    activeApp = undefined;
  });

  it('keeps the health endpoint responsive under a small burst', async () => {
    const { app } = await createApiGatewayTestApp();
    activeApp = app;

    const iterations = 20;
    const startedAt = Date.now();

    const responses = await Promise.all(
      Array.from({ length: iterations }, () =>
        app.inject({
          method: 'GET',
          url: '/health'
        })
      )
    );

    const durationMs = Date.now() - startedAt;

    expect(responses.every((response) => response.statusCode === 200)).toBe(true);
    expect(durationMs / iterations).toBeLessThan(100);
  });

  it('handles 100 parallel analyze requests without losing responses', async () => {
    const { app } = await createApiGatewayTestApp({
      env: {
        RATE_LIMIT_GLOBAL_PER_MIN: '500',
        RATE_LIMIT_USER_PER_MIN: '500',
        RATE_LIMIT_ANALYZE_PER_MIN: '500',
        RATE_LIMIT_USER_DAILY: '500'
      }
    });
    activeApp = app;

    const startedAt = Date.now();
    const responses = await Promise.all(
      Array.from({ length: 100 }, (_, index) =>
        app.inject({
          method: 'POST',
          url: '/v1/analyze',
          headers: {
            authorization: 'Bearer valid-access-token',
            'x-request-id': `perf-100-${index}`
          },
          payload: {
            content: `parallel message ${index}`,
            canal: 'slack',
            interlocuteurId: `contact-${index}`
          }
        })
      )
    );
    const durationMs = Date.now() - startedAt;

    expect(responses.every((response) => response.statusCode === 201)).toBe(true);
    expect(durationMs).toBeLessThan(5000);
  });

  it.skipIf(!runLoad)('handles 500 parallel analyze requests in controlled load mode', async () => {
    const { app } = await createApiGatewayTestApp({
      env: {
        RATE_LIMIT_GLOBAL_PER_MIN: '2000',
        RATE_LIMIT_USER_PER_MIN: '2000',
        RATE_LIMIT_ANALYZE_PER_MIN: '2000',
        RATE_LIMIT_USER_DAILY: '2000'
      }
    });
    activeApp = app;

    const responses = await Promise.all(
      Array.from({ length: 500 }, (_, index) =>
        app.inject({
          method: 'POST',
          url: '/v1/analyze',
          headers: {
            authorization: 'Bearer valid-access-token',
            'x-request-id': `perf-500-${index}`
          },
          payload: {
            content: `parallel load message ${index}`,
            canal: 'slack',
            interlocuteurId: `contact-${index}`
          }
        })
      )
    );

    const successCount = responses.filter((response) => response.statusCode === 201).length;
    expect(successCount).toBeGreaterThanOrEqual(475);
  });

  it.skipIf(!runStress)('survives 1000 parallel analyze requests in stress mode', async () => {
    const { app } = await createApiGatewayTestApp({
      env: {
        RATE_LIMIT_GLOBAL_PER_MIN: '4000',
        RATE_LIMIT_USER_PER_MIN: '4000',
        RATE_LIMIT_ANALYZE_PER_MIN: '4000',
        RATE_LIMIT_USER_DAILY: '4000'
      }
    });
    activeApp = app;

    const responses = await Promise.all(
      Array.from({ length: 1000 }, (_, index) =>
        app.inject({
          method: 'POST',
          url: '/v1/analyze',
          headers: {
            authorization: 'Bearer valid-access-token',
            'x-request-id': `perf-1000-${index}`
          },
          payload: {
            content: `parallel stress message ${index}`,
            canal: 'slack',
            interlocuteurId: `contact-${index}`
          }
        })
      )
    );

    const successCount = responses.filter((response) => response.statusCode === 201).length;
    expect(successCount).toBeGreaterThanOrEqual(900);
  });
});
