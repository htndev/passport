import { CookieService } from './../common/providers/cookie/cookie.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'src/common/providers/config/app.config';
import { SecurityConfig } from 'src/common/providers/config/security.config';

import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { LocationIdentifierModule } from '../common/providers/location-identifier/location-identifier.module';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { TokenService } from './../common/providers/token/token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import {DateService} from '../common/providers/date/date.service';

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
        { jwtPassportTokenSecret: secret, jwtTokenExpiresIn: expiresIn }: SecurityConfig,
        { appHostname: issuer }: AppConfig
      ) => ({
        secret,
        signOptions: { expiresIn, issuer, subject: 'auth' }
      })
    }),
    TypeOrmModule.forFeature([UserRepository, LocationRepository]),
    LocationIdentifierModule,
    ConfigManagerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, CookieService, DateService],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
