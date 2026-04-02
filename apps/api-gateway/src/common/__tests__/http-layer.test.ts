import { ArgumentsHost, BadRequestException, HttpException, Logger } from '@nestjs/common';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalExceptionFilter } from '../filters/global-exception.filter.js';
import { TransformInterceptor } from '../interceptors/transform.interceptor.js';

describe('HTTP layer primitives', () => {
  beforeEach(() => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('wraps successful responses with request metadata', async () => {
    const interceptor = new TransformInterceptor();

    const result = await new Promise<unknown>((resolve) => {
      interceptor
        .intercept(
          {
            switchToHttp: () => ({
              getRequest: () => ({
                headers: {
                  'x-request-id': 'req_http_layer'
                }
              })
            })
          } as never,
          {
            handle: () => of({ ok: true })
          } as never
        )
        .subscribe(resolve);
    });

    expect(result).toMatchObject({
      requestId: 'req_http_layer',
      data: { ok: true }
    });
  });

  it('normalizes HTTP exceptions into the public error contract', () => {
    const filter = new GlobalExceptionFilter();
    const send = vi.fn();
    const status = vi.fn(() => ({ send }));

    filter.catch(
      new BadRequestException('Bad payload'),
      {
        switchToHttp: () => ({
          getResponse: () => ({ status }),
          getRequest: () => ({
            headers: { 'x-request-id': 'req_error_1' },
            url: '/v1/analyze',
            method: 'POST'
          })
        })
      } as ArgumentsHost
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'req_error_1',
        error: {
          statusCode: 400,
          message: 'Bad payload',
          path: '/v1/analyze',
          method: 'POST'
        }
      })
    );
  });

  it('falls back to 500 for unexpected exceptions', () => {
    const filter = new GlobalExceptionFilter();
    const send = vi.fn();
    const status = vi.fn(() => ({ send }));

    filter.catch(
      new Error('Unexpected failure'),
      {
        switchToHttp: () => ({
          getResponse: () => ({ status }),
          getRequest: () => ({
            headers: {},
            url: '/auth/login',
            method: 'POST'
          })
        })
      } as ArgumentsHost
    );

    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: null,
        error: {
          statusCode: 500,
          message: 'Internal server error',
          path: '/auth/login',
          method: 'POST'
        }
      })
    );
  });

  it('keeps explicit http exception messages intact', () => {
    const filter = new GlobalExceptionFilter();
    const send = vi.fn();
    const status = vi.fn(() => ({ send }));

    filter.catch(
      new HttpException({ message: ['field is required'] }, 422),
      {
        switchToHttp: () => ({
          getResponse: () => ({ status }),
          getRequest: () => ({
            headers: { 'x-request-id': 'req_error_2' },
            url: '/auth/register',
            method: 'POST'
          })
        })
      } as ArgumentsHost
    );

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: 422,
          message: ['field is required']
        })
      })
    );
  });
});
