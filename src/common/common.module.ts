import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { AppConfig } from './providers/config/app.config';
import { SecurityConfig } from './providers/config/security.config';
import { DateService } from './providers/date/date.service';

@Module({
  imports: [
    PassportModule.registerAsync({
      imports: [ConfigManagerModule],
      inject: [SecurityConfig],
      useFactory: ({ defaultPassportStrategy: defaultStrategy }: SecurityConfig) => ({ defaultStrategy })
    }),
    JwtModule.registerAsync({
      imports: [ConfigManagerModule],
      inject: [SecurityConfig, AppConfig],
      useFactory: (
        { jwtPassportTokenSecret: secret, jwtAccessTokenExpiresIn: expiresIn }: SecurityConfig,
        { appHostname: issuer }: AppConfig
      ) => ({
        secret,
        signOptions: { expiresIn, issuer, subject: 'auth' }
      })
    }),
    ConfigManagerModule
  ],
  providers: [DateService],
  exports: [PassportModule, JwtModule, ConfigManagerModule, DateService]
})
export class CommonModule {}
