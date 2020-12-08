import { formatGqlError } from './common/utils/format-gql-error';
import { AppConfig } from './common/providers/config/app.config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { ConfigModule as ConfigManagerModule } from './common/providers/config/config.module';
import { DatabaseConfig } from './common/providers/config/database.config';
import { TokensModule } from './tokens/tokens.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
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
    GraphQLModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [AppConfig],
      useFactory: ({ isDevMode }: AppConfig) => ({
        autoSchemaFile: true,
        playground: isDevMode ? {
          settings: {
            'request.credentials': 'include'
          }
        } : false,
        useGlobalPrefix: true,
        context: ({ req, res }: any): any => ({ req, res }),
        formatError: formatGqlError(isDevMode)
      })
    }),
    TokensModule,
    UserModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
