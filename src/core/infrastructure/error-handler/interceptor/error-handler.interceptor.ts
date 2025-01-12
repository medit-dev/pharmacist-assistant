import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { ErrorHandlerPort } from 'src/core/infrastructure/error-handler/error-handler.port';

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  constructor(private readonly errorHandler: ErrorHandlerPort) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.errorHandler.captureException(err);

        throw err;
      }),
    );
  }
}
