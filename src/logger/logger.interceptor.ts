import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url } = request;
    const query = request.query || {};
    const body = request.body || {};

    const reqMsg = `Request: ${method} ${url} ; body: ${JSON.stringify(
      body,
    )} ; query: ${JSON.stringify(query)}`;

    this.loggingService.log(reqMsg, '----- request end');

    return next.handle().pipe(
      tap(() => {
        const resMsg = `Response: ${response.statusCode} - ${method} ${url}`;
        this.loggingService.log(resMsg, '----- response end');
      }),
    );
  }
}
