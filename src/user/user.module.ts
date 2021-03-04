import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { CookieModule } from '../common/providers/cookie/cookie.module';
import { LocationIdentifierModule } from '../common/providers/location-identifier/location-identifier.module';
import { RedisWrapperModule } from '../common/providers/redis-wrapper/redis-wrapper.module';
import { TokenModule } from '../common/providers/token/token.module';
import { LocationService } from '../location/location.service';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, LocationRepository]),
    CommonModule,
    RedisWrapperModule,
    LocationIdentifierModule,
    ConfigManagerModule,
    TokenModule,
    CookieModule
  ],
  providers: [UserResolver, UserService, LocationService]
})
export class UserModule {}
