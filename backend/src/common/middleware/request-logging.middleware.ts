import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = randomUUID();

    // Return the ID to the caller so a request can be traced in logs.
    response.setHeader('X-Request-Id', requestId);

    console.log(
      `[Request] ${request.method} ${request.originalUrl} | ID: ${requestId}`,
    );

    next();
  }
}
