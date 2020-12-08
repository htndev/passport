import { Global, Module } from '@nestjs/common';

import { CommonModule } from './../../common.module';
import { ConfigModule } from './../config/config.module';
import { DateService } from './../date/date.service';
import { TokenService } from './../token/token.service';
import { CookieService } from './cookie.service';

@Global()
@Module({
  imports: [CommonModule, ConfigModule],
  providers: [CookieService, TokenService, DateService],
  exports: [CookieService]
})
export class CookieModule {}
