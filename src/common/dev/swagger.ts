import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const errorBuilder = (separator: string, ...errors: string[]): string => errors.join(separator);

export async function setupSwagger(app: INestApplication): Promise<void> {
  const packageConfig = await import('../../../package.json');
  const logger = new Logger('Swagger');

  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version || '')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  logger.verbose(`Swagger documentation available on route /docs`);
}
