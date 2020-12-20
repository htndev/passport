import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CommonModule } from './../../common.module';
import { SecurityConfig } from './../config/security.config';
import { RedisWrapperModule } from './../redis-wrapper/redis-wrapper.module';
import { RedisWrapperService } from './../redis-wrapper/redis-wrapper.service';
import { TokenService } from './token.service';

@Module({
  imports: [CommonModule, RedisWrapperModule],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
