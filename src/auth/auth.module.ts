import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'src/common/providers/config/app.config';
import { SecurityConfig } from 'src/common/providers/config/security.config';

import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { LocationIdentifierModule } from '../common/providers/location-identifier/location-identifier.module';
import { UserRepository } from '../repositories/user.repository';
import { LocationRepository } from '../repositories/location.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

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
        { jwtTokenSecret: secret, jwtTokenExpiresIn: expiresIn }: SecurityConfig,
        { appHostname: issuer }: AppConfig
      ) => ({
        secret: secret,
        signOptions: { expiresIn, issuer, subject: 'auth' }
      })
    }),
    TypeOrmModule.forFeature([UserRepository, LocationRepository]),
    LocationIdentifierModule,
    ConfigManagerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
