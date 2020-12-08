import { Request, Response } from 'express';
import { Logger, NestMiddleware } from '@nestjs/common';

const logger = new Logger('Request');

export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    logger.verbose(`Incoming ${req.method}: ${req.originalUrl}`);
    next();
  }
}
