import { Module } from '@nestjs/common';

import { CommonModule } from './../common/common.module';
import { CookieService } from './../common/providers/cookie/cookie.service';
import { TokenService } from './../common/providers/token/token.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  imports: [CommonModule],
  controllers: [TokensController],
  providers: [TokensService, TokenService, CookieService]
})
export class TokensModule {}
