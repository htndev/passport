import { CookieModule } from './../common/providers/cookie/cookie.module';
import { Module } from '@nestjs/common';

import { CommonModule } from './../common/common.module';
import { TokenService } from './../common/providers/token/token.service';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  imports: [CommonModule, CookieModule],
  controllers: [TokensController],
  providers: [TokensService, TokenService]
})
export class TokensModule {}
