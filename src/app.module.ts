import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfig } from './common/providers/config/app.config';
import { ConfigModule as ConfigManagerModule } from './common/providers/config/config.module';
import { DatabaseConfig } from './common/providers/config/database.config';
import { SecurityConfig } from './common/providers/config/security.config';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports: [ConfigManagerModule],
      inject: [SecurityConfig],
      // useFactory: async ({jwtTokenSecret: secret}: SecurityConfig) => {
      useFactory: async (config: SecurityConfig) => {
        console.log(config);
        return {
          secret: config.jwtTokenSecret,
          // signOptions: 
        };
      }
    }),
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [DatabaseConfig],
      useFactory: async ({ type, host, username, password, database, synchronize, logging }: DatabaseConfig) =>
        ({
          type,
          host,
          username,
          password,
          database,
          synchronize,
          logging,
          entities: [`${__dirname}/entities/*.entity.{ts,js}`]
        } as TypeOrmModuleOptions)
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, AppConfig]
})
export class AppModule {}
