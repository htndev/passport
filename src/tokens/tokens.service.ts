import { Injectable } from '@nestjs/common';

import { MICROSERVICES } from '../common/constants/microservice.constant';
import { REFRESH_TOKEN } from '../common/constants/token.constant';
import { MicroserviceToken, TokenType } from '../common/constants/type.constant';
import { SecurityConfig } from '../common/providers/config/security.config';
import { RedisWrapperService } from '../common/providers/redis-wrapper/redis-wrapper.service';
import { TokenService } from '../common/providers/token/token.service';
import { mapAsync } from '../common/utils/async-iterators.util';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly securityConfig: SecurityConfig,
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
    const refreshToken = await this.redisWrapperService.getToken(uuid, REFRESH_TOKEN) as string;

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
