import { CommonModule } from './../../common.module';
import { DateService } from './../date/date.service';
import { TokenService } from './../token/token.service';
import { ConfigModule } from './../config/config.module';
import { CookieService } from './cookie.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [CommonModule, ConfigModule],
  providers: [CookieService, TokenService, DateService],
  exports: [CookieService]
})
export class CookieModule {}
