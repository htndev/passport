import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { ConfigModule as ConfigManagerModule } from './common/providers/config/config.module';
import { DatabaseConfig } from './common/providers/config/database.config';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [DatabaseConfig],
      useFactory: ({
        type,
        host,
        username,
        password,
        database,
        synchronize,
        logging,
        dbConnectionRetryAttempts: retryAttempts
      }: DatabaseConfig) =>
        ({
          type,
          host,
          username,
          password,
          database,
          synchronize,
          logging,
          retryAttempts,
          entities: [`${__dirname}/entities/*.entity.{ts,js}`]
        } as TypeOrmModuleOptions)
    }),
    AuthModule,
    TokensModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
