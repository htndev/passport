import { Injectable } from '@nestjs/common';

import { SecurityConfig } from '../common/providers/config/security.config';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { TokenService } from '../common/providers/token/token.service';
import { MicroserviceToken, TokenType } from '../common/types';
import { mapAsync } from '../common/utils/async-iterators.util';
import { MICROSERVICES, REFRESH_TOKEN } from './../common/constants';
import { RedisWrapperService } from './../common/providers/redis-wrapper/redis-wrapper.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly securityConfig: SecurityConfig,
    private readonly cookieService: CookieService,
    private readonly redisWrapperService: RedisWrapperService
  ) {}

  async getTokens(uuid: string): Promise<Required<MicroserviceToken>> {
    const tokens = await this.redisWrapperService.getAvailableTokens(uuid);
    if (Object.keys(tokens).length === MICROSERVICES.length) {
      return { ...tokens } as Required<MicroserviceToken>;
    }

    return this.generateTokens(uuid);
  }

  async generateTokens(uuid: string): Promise<Required<MicroserviceToken>> {
    const refreshToken = await this.redisWrapperService.getToken(uuid, REFRESH_TOKEN);

    const { username, email } = await this.tokenService.parseToken(
      refreshToken,
      this.securityConfig.jwtRefreshTokenSecret
    );

    const tokens = await this.tokenService.generateTokens({ username, email });

    await mapAsync(Object.entries(tokens), async ([microservice, token]: [TokenType, string]) =>
      this.redisWrapperService.setToken(uuid, microservice, token, this.securityConfig.jwtAccessTokenExpiresIn)
    );

    return tokens as Required<MicroserviceToken>;
  }
}
