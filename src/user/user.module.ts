import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { User } from '../entities/user.entity';
import { CookieModule } from './../common/providers/cookie/cookie.module';
import { LocationIdentifierModule } from './../common/providers/location-identifier/location-identifier.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    LocationIdentifierModule,
    ConfigManagerModule,
    CookieModule
  ],
  providers: [UserResolver, UserService]
})
export class UserModule {}
