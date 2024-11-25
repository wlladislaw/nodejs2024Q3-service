import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class LogExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggingService: LoggerService,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const resBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    this.loggingService.error(
      `Exception : ${message} -----`,
      exception.stack,
      'Eception filter context',
    );

    httpAdapter.reply(ctx.getResponse(), resBody, httpStatus);
  }
}
