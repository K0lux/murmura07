import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string> }>();

    return next.handle().pipe(
      map((data) => ({
        requestId: request.headers?.['x-request-id'] ?? null,
        timestamp: new Date().toISOString(),
        data
      }))
    );
  }
}
