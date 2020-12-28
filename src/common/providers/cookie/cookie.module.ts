import { Global, Module } from '@nestjs/common';

import { CommonModule } from './../../common.module';
import { ConfigModule } from './../config/config.module';
import { DateService } from './../date/date.service';
import { RedisWrapperModule } from './../redis-wrapper/redis-wrapper.module';
import { RedisWrapperService } from './../redis-wrapper/redis-wrapper.service';
import { TokenModule } from './../token/token.module';
import { TokenService } from './../token/token.service';
import { CookieService } from './cookie.service';

@Global()
@Module({
  imports: [CommonModule, ConfigModule, TokenModule, RedisWrapperModule],
  providers: [CookieService, TokenService, DateService, RedisWrapperService],
  exports: [CookieService]
})
export class CookieModule {}
