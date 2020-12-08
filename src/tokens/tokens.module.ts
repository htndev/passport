import { Module } from '@nestjs/common';

import { CommonModule } from './../common/common.module';
import { CookieModule } from './../common/providers/cookie/cookie.module';
import { TokenService } from './../common/providers/token/token.service';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [CommonModule, CookieModule],
  providers: [TokensResolver, TokensService, TokenService]
})
export class TokensModule {}
