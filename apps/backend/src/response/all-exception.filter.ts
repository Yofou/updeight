import { ResponseService } from './response.service';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private formater: ResponseService,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let body: any;
    if (typeof exception.response?.message === 'object') {
      body = this.formater.formatFailure(exception.response?.message?.[0]);
    } else if (typeof exception.response?.message === 'string') {
      body = this.formater.formatFailure(exception.response.message);
    } else if (exception.message) {
      body = this.formater.formatFailure(exception.message);
    } else {
      body = this.formater.formatFailure(
        "Something unexpected happend, we've been notified and please try again later.",
      );
    }

    httpAdapter.reply(ctx.getResponse(), body, httpStatus);
  }
}
