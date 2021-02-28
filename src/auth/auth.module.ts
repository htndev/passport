import { ApiEndpoint } from '@xbeat/toolkit';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategyFactory, AppConfig } from '@xbeat/server-toolkit';

import { CommonModule } from '../common/common.module';
import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { CookieModule } from '../common/providers/cookie/cookie.module';
import { LocationIdentifierModule } from '../common/providers/location-identifier/location-identifier.module';
import { RedisWrapperModule } from '../common/providers/redis-wrapper/redis-wrapper.module';
import { TokenModule } from '../common/providers/token/token.module';
import { UuidModule } from '../common/providers/uuid/uuid.module';
import { EmailRepository } from '../repositories/email.repository';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

const JwtStrategy = JwtStrategyFactory(ApiEndpoint.Passport, UserRepository, AppConfig);

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([UserRepository, LocationRepository, EmailRepository]),
    LocationIdentifierModule,
    ConfigManagerModule,
    CookieModule,
    TokenModule,
    RedisWrapperModule,
    UuidModule
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy]
})
export class AuthModule {}
