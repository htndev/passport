import { Request, Response } from 'express';
import { Logger, NestMiddleware } from "@nestjs/common";

export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    Logger.verbose(`Incoming ${req.method}: ${req.originalUrl}`);
    next();
  }
}