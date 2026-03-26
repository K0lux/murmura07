import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{ status: (code: number) => { send: (body: unknown) => void } }>();
    const request = ctx.getRequest<{ headers?: Record<string, string>; url?: string; method?: string }>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : 'Internal server error';
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string | string[] }).message ?? 'Unexpected error';

    this.logger.error(
      `${request.method ?? 'UNKNOWN'} ${request.url ?? ''} failed: ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception)
    );

    response.status(status).send({
      requestId: request.headers?.['x-request-id'] ?? null,
      timestamp: new Date().toISOString(),
      error: {
        statusCode: status,
        message,
        path: request.url ?? '',
        method: request.method ?? ''
      }
    });
  }
}
