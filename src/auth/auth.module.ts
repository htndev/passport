import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { LocationIdentifierModule } from '../common/providers/location-identifier/location-identifier.module';
import { TokenService } from '../common/providers/token/token.service';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { CommonModule } from './../common/common.module';
import { CookieService } from './../common/providers/cookie/cookie.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([UserRepository, LocationRepository]),
    LocationIdentifierModule,
    ConfigManagerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, CookieService]
})
export class AuthModule {}
