import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfig } from './common/providers/config/app.config';
import { ConfigModule as ConfigManagerModule } from './common/providers/config/config.module';
import { DatabaseConfig } from './common/providers/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [DatabaseConfig],
      useFactory: async ({
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
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, AppConfig]
})
export class AppModule {}
