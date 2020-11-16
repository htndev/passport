import { SecurityConfig } from './common/providers/config/security.config';
import { AppConfig } from './common/providers/config/app.config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/dev/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupHttps } from './common/dev/https';

async function bootstrap() {
  const options = await setupHttps();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, options);
  const config = app.get(AppConfig);
  const { cookieSecret } = app.get(SecurityConfig);

  app.enableCors({
    origin: config.allowedDomains,
    allowedHeaders: config.allowedHeaders,
    credentials: true
  });
  app.disable('x-powered-by');
  app.use(cookieParser(cookieSecret));
  app.use(helmet());
  app.use(compression());

  if (config.enableSwagger) {
    setupSwagger(app);
  }

  Logger.log(`Application run ${config.url}`);
  await app.listen(config.port);
}

bootstrap();
