import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '../auth/auth.service';
import { CommonModule } from '../common/common.module';
import { ConfigModule as ConfigManagerModule } from '../common/providers/config/config.module';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { CookieModule } from './../common/providers/cookie/cookie.module';
import { LocationIdentifierModule } from './../common/providers/location-identifier/location-identifier.module';
import { TokenService } from './../common/providers/token/token.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Location]),
    CommonModule,
    LocationIdentifierModule,
    ConfigManagerModule,
    CookieModule
  ],
  providers: [UserResolver, UserService, AuthService, TokenService]
})
export class UserModule {}
