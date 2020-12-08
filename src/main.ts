import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { setupHttps } from './common/dev/https';
import { setupSwagger } from './common/dev/swagger';
import { AppConfig } from './common/providers/config/app.config';
import { SecurityConfig } from './common/providers/config/security.config';

async function bootstrap() {
  const options = await setupHttps();
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, options);
  const config = app.get(AppConfig);
  const { cookieSecret } = app.get(SecurityConfig);

  app.useGlobalPipes(new ValidationPipe());
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

  if (config.enableSwagger) {
    setupSwagger(app);
  }

  await app.listen(config.port);
  logger.log(`Application run ${config.url}`);
}

bootstrap();
