import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../common/providers/config/config.module';
import { RedisWrapperModule } from '../common/providers/redis-wrapper/redis-wrapper.module';
import { TokenModule } from '../common/providers/token/token.module';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../user/user.service';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, LocationRepository]),
    ConfigModule,
    RedisWrapperModule,
    TokenModule
  ],
  providers: [LocationService, UserService, LocationResolver]
})
export class LocationModule {}
