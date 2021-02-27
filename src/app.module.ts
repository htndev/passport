import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import {
  AppConfig,
  DatabaseConfig,
  formatGqlError,
  NodeEnvironment,
  RedisConfig,
  RequestLoggerMiddleware
} from '@xbeat/server-toolkit';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule as ConfigManagerModule } from './common/providers/config/config.module';
import { LocationModule } from './location/location.module';
import { TokensModule } from './tokens/tokens.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === NodeEnvironment.PRODUCTION
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
      useFactory: ({ isDevMode, allowedDomains }: AppConfig) => ({
        autoSchemaFile: true,
        cors: {
          credentials: true,
          origin: allowedDomains
        },
        playground: {
          settings: {
            'request.credentials': 'same-origin',
            'schema.polling.interval': 200000
          }
        },
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
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe()
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
