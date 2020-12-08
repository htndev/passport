import { Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

const logger = new Logger('Request');

export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    logger.verbose(`Incoming ${req.method}: ${req.originalUrl}`);
    next();
  }
}
