import { afterEach, describe, expect, it } from 'vitest';
import { createApiGatewayTestApp } from '../helpers/test-app.js';

describe('Auth flow E2E', () => {
  let activeApp: Awaited<ReturnType<typeof createApiGatewayTestApp>>['app'] | undefined;

  afterEach(async () => {
    await activeApp?.close();
    activeApp = undefined;
  });

  it('runs the register, login, refresh, otp verification and logout journey', async () => {
    const refreshTokens: string[] = [];

    const { app } = await createApiGatewayTestApp({
      authService: {
        register: async (email: string) => ({ id: 'user-1', email }),
        login: async () => {
          refreshTokens.push('refresh-token-1');
          return {
            accessToken: 'valid-access-token',
            refreshToken: 'refresh-token-1'
          };
        },
        refresh: async (refreshToken: string) => {
          expect(refreshToken).toBe('refresh-token-1');
          refreshTokens.push('refresh-token-2');
          return {
            accessToken: 'valid-access-token-2',
            refreshToken: 'refresh-token-2'
          };
        },
        logout: async (refreshToken: string) => ({
          loggedOut: refreshToken === 'refresh-token-2'
        }),
        requestPhoneVerificationOtp: async (_userId: string, phoneNumber: string) => ({
          phoneNumber,
          expiresInSeconds: 600,
          resendAvailableInSeconds: 60,
          otp: '654321'
        }),
        verifyPhoneOtp: async (_userId: string, phoneNumber: string, otp: string) => ({
          verified: otp === '654321',
          user: {
            id: 'user-1',
            email: 'flow@example.com',
            phoneNumber
          }
        })
      }
    });
    activeApp = app;

    const registerResponse = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'flow@example.com',
        password: 'P@ssword123',
        firstName: 'Flow'
      }
    });
    expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'flow@example.com',
        password: 'P@ssword123'
      }
    });
    expect(loginResponse.statusCode).toBe(201);
    expect(loginResponse.json()).toMatchObject({
      data: {
        accessToken: 'valid-access-token',
        refreshToken: 'refresh-token-1'
      }
    });

    const refreshResponse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: {
        refreshToken: 'refresh-token-1'
      }
    });
    expect(refreshResponse.statusCode).toBe(201);
    expect(refreshResponse.json()).toMatchObject({
      data: {
        accessToken: 'valid-access-token-2',
        refreshToken: 'refresh-token-2'
      }
    });

    const requestOtpResponse = await app.inject({
      method: 'POST',
      url: '/auth/phone/request-otp',
      headers: {
        authorization: 'Bearer valid-access-token-2'
      },
      payload: {
        phoneNumber: '+22890123456'
      }
    });
    expect(requestOtpResponse.statusCode).toBe(201);
    expect(requestOtpResponse.json()).toMatchObject({
      data: {
        phoneNumber: '+22890123456',
        otp: '654321'
      }
    });

    const verifyOtpResponse = await app.inject({
      method: 'POST',
      url: '/auth/phone/verify-otp',
      headers: {
        authorization: 'Bearer valid-access-token-2'
      },
      payload: {
        phoneNumber: '+22890123456',
        otp: '654321'
      }
    });
    expect(verifyOtpResponse.statusCode).toBe(201);
    expect(verifyOtpResponse.json()).toMatchObject({
      data: {
        verified: true,
        user: {
          phoneNumber: '+22890123456'
        }
      }
    });

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: {
        authorization: 'Bearer valid-access-token-2'
      },
      payload: {
        refreshToken: 'refresh-token-2'
      }
    });

    expect(logoutResponse.statusCode).toBe(201);
    expect(logoutResponse.json()).toMatchObject({
      data: {
        loggedOut: true
      }
    });
    expect(refreshTokens).toEqual(['refresh-token-1', 'refresh-token-2']);
  });
});
