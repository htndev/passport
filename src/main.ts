import { AppConfig } from './common/providers/config/app.config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/dev/swagger';
import * as compression from 'compression';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

  app.use(cookieParser());
  console.log(config.allowedDomains);
  app.use(cors({
    origin: config.allowedDomains,
    credentials: true
  }));
  app.use(compression());

  if(config.enableSwagger) {
    setupSwagger(app);
  }

  Logger.log('Application run http://localhost:3000');
  await app.listen(config.port);
}
bootstrap();
