import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { NodeEnv } from './common/constants/env.constant';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { AppConfig } from './common/providers/config/app.config';
import { ConfigModule as ConfigManagerModule } from './common/providers/config/config.module';
import { DatabaseConfig } from './common/providers/config/database.config';
import { RedisConfig } from './common/providers/config/redis.config';
import { formatGqlError } from './common/utils/format-gql-error.util';
import { LocationModule } from './location/location.module';
import { TokensModule } from './tokens/tokens.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === NodeEnv.PRODUCTION
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
        port,
        dbConnectionRetryAttempts: retryAttempts
      }: DatabaseConfig) =>
        ({
          type,
          host,
          port,
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
        playground: isDevMode
          ? {
              settings: {
                'request.credentials': 'include'
              }
            }
          : false,
        useGlobalPrefix: true,
        context: ({ req, res }: any): any => ({ req, res }),
        formatError: formatGqlError(isDevMode)
      })
    }),
    RedisModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [RedisConfig],
      useFactory: ({ port, password, host, keyPrefix, name }: RedisConfig) => ({
        name,
        port,
        host,
        password,
        keyPrefix
      })
    }),
    AuthModule,
    CommonModule,
    TokensModule,
    UserModule,
    LocationModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
