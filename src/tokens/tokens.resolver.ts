import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { HasUuidGuard } from '../common/guards/token/has-uuid.guard';
import { CookieSetterFunction } from '../common/utils/types';
import { CookieSetter } from './../common/decorators/cookie-setter.decorator';
import { GetUuid } from './../common/decorators/get-uuid.decorator';
import { TokenType } from './token.type';
import { TokensService } from './tokens.service';

@UseGuards(HasUuidGuard)
@Resolver(() => TokenType)
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @Query(() => TokenType)
  async getTokens(@GetUuid() uuid: string): Promise<TokenType> {
    return this.tokensService.getTokens(uuid);
  }
}
