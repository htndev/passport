import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig, setupSwagger } from '@xbeat/server-toolkit';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { SecurityConfig } from './common/providers/config/security.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(AppConfig);
  const { cookieSecret } = app.get(SecurityConfig);

  app.setGlobalPrefix(config.apiVersion);
  app.enableCors({
    origin: config.allowedDomains,
    allowedHeaders: config.allowedHeaders,
    credentials: true
  });
  app.disable('x-powered-by');
  app.use(cookieParser(cookieSecret));
  app.use(helmet({ contentSecurityPolicy: !config.isDevMode ? undefined : false }));
  app.use(compression());

  if (config.isDebugMode) {
    logger.verbose(`GraphQL playground available on ${config.url}/${config.apiVersion}/graphql`);
  }

  if (config.enableSwagger) {
    setupSwagger(app, await import('../package.json'));
  }

  await app.listen(config.port);
  logger.log(`Application run ${config.url}`);
}

bootstrap();
