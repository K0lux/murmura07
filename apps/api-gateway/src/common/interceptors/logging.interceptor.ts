import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method?: string;
      url?: string;
      headers?: Record<string, string>;
      user?: { userId?: string };
    }>();
    const response = context.switchToHttp().getResponse<{ statusCode?: number }>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            JSON.stringify({
              requestId: request.headers?.['x-request-id'],
              method: request.method,
              path: request.url,
              userId: request.user?.userId ?? null,
              statusCode: response.statusCode ?? 200,
              durationMs: Date.now() - startedAt
            })
          );
        }
      })
    );
  }
}
