import { Injectable } from '@nestjs/common';

import { MICROSERVICES, REFRESH_TOKEN_COOKIE } from '../common/constants';
import { SecurityConfig } from '../common/providers/config/security.config';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { TokenService } from '../common/providers/token/token.service';
import { CookieSetterFunction, MicroserviceToken } from '../common/utils/types';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly securityConfig: SecurityConfig,
    private readonly cookieService: CookieService
  ) {}

  async getTokens(
    cookies: MicroserviceToken,
    cookieSetter: CookieSetterFunction
  ): Promise<Required<MicroserviceToken>> {
    if (Object.keys(cookies).length === MICROSERVICES.length) {
      return { ...cookies } as Required<MicroserviceToken>;
    }

    const newTokens = await this.generateTokens(cookies, cookieSetter);

    return newTokens;
  }

  async generateTokens(
    cookies: Record<string, any>,
    cookieSetter: CookieSetterFunction
  ): Promise<Required<MicroserviceToken>> {
    const refreshToken = this.cookieService.getCookie(cookies, REFRESH_TOKEN_COOKIE);

    const { username, email } = await this.tokenService.parseToken(
      refreshToken,
      this.securityConfig.jwtRefreshTokenSecret
    );

    const tokens = await this.tokenService.generateTokens({ username, email });
    await this.cookieService.setBatchOfCookies(cookieSetter, tokens);

    return tokens as Required<MicroserviceToken>;
  }
}
