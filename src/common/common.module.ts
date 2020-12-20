import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule } from '../common/providers/config/config.module';
import { AppConfig } from './providers/config/app.config';
import { SecurityConfig } from './providers/config/security.config';
import { DateService } from './providers/date/date.service';

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
    ConfigModule
  ],
  providers: [DateService],
  exports: [PassportModule, JwtModule, ConfigModule, DateService]
})
export class CommonModule {}
