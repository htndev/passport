import { RedisWrapperModule } from './../common/providers/redis-wrapper/redis-wrapper.module';
import { Module } from '@nestjs/common';

import { CommonModule } from './../common/common.module';
import { CookieModule } from './../common/providers/cookie/cookie.module';
import { TokenModule } from './../common/providers/token/token.module';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [CommonModule, CookieModule, TokenModule, RedisWrapperModule],
  providers: [TokensResolver, TokensService]
})
export class TokensModule {}
