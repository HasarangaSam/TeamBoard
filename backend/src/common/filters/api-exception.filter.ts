import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if ('message' in body) {
        const detail = body.message;

        if (
          typeof detail === 'string' ||
          (Array.isArray(detail) &&
            detail.every((item) => typeof item === 'string'))
        ) {
          message = detail as string | string[];
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    }

    if (status >= 500) {
      // Keep internal exception details out of the public response.
      this.logger.error(
        `${request.method} ${request.originalUrl} failed with status ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      method: request.method,
      message,
    });
  }
}
