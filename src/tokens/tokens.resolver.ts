import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { HasRefreshTokenGuard } from '../common/guards/token/has-refresh-token.guard';
import { CookieSetterFunction } from '../common/utils/types';
import { CookieGetter } from './../common/decorators/cookie-getter.decorator';
import { CookieSetter } from './../common/decorators/cookie-setter.decorator';
import { TokenType } from './../common/types/token.type';
import { TokensService } from './tokens.service';

@UseGuards(HasRefreshTokenGuard)
@Resolver((of) => TokenType)
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @Query((returns) => TokenType)
  async getTokens(
    @CookieGetter() cookies: Record<string, any>,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<any> {
    return this.tokensService.getTokens(cookies, cookieSetter);
  }
}
