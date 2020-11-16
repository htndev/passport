import { AppConfig } from './../providers/config/app.config';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app: INestApplication): Promise<void> {
  const packageConfig = await import('../../../package.json');

  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version || '')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  Logger.verbose(`Swagger documentation available on route /docs`);
}
