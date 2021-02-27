import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig, DateService } from '@xbeat/server-toolkit';

import { ConfigModule } from '../common/providers/config/config.module';
import { SecurityConfig } from './providers/config/security.config';
import { DynamicRabbitMQModule } from './providers/rabbitmq/rabbitmq.provider';

@Module({
  imports: [
    PassportModule.registerAsync({
      imports: [ConfigModule],
      inject: [SecurityConfig],
      useFactory: ({ defaultPassportStrategy: defaultStrategy }: SecurityConfig) => ({ defaultStrategy })
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [SecurityConfig, AppConfig],
      useFactory: (
        { jwtPassportTokenSecret: secret, jwtAccessTokenExpiresIn: expiresIn }: SecurityConfig,
        { appHostname: issuer }: AppConfig
      ) => ({
        secret,
        signOptions: { expiresIn, issuer, subject: 'auth' }
      })
    }),
    ConfigModule,
    DynamicRabbitMQModule
  ],
  providers: [DateService],
  exports: [PassportModule, JwtModule, ConfigModule, DateService, DynamicRabbitMQModule]
})
export class CommonModule {}
