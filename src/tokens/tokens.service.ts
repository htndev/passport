import { REFRESH_COOKIE } from './../common/constants';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { MICROSERVICES } from '../common/constants';
import { SecurityConfig } from '../common/providers/config/security.config';
import { TokenService } from '../common/providers/token/token.service';
import { CookieService } from './../common/providers/cookie/cookie.service';
import { MicroserviceTokens } from './../common/types';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly securityConfig: SecurityConfig,
    private readonly cookieService: CookieService
  ) {}

  async getTokens(request: Request, response: Response): Promise<MicroserviceTokens> {
    const regexp = () => new RegExp(`${this.securityConfig.tokenPrefix}(${MICROSERVICES.join('|')})`, 'g');

    const tokens = Object.keys(request.signedCookies)
      .filter(cookie => regexp().test(cookie))
      .reduce(
        (acc: any, cookie: string) => ({
          ...acc,
          [this.tokenService.getMicroserviceName(cookie)]: this.cookieService.getCookie(request, cookie)
        }),
        {}
      );

    if (!isEmpty(tokens)) {
      return { tokens };
    }

    const newTokens = await this.generateTokens(request, response);

    return { tokens: newTokens };
  }

  // async generateTokens({ cookies }: Request): Promise<MicroserviceToken> {
  async generateTokens(request: Request, response: Response): Promise<any> {
    const refreshToken = this.cookieService.getCookie(request, `${this.securityConfig.tokenPrefix}${REFRESH_COOKIE}`);

    const { username, email } = await this.tokenService.parseToken(
      refreshToken,
      this.securityConfig.jwtRefreshTokenSecret
    );

    const tokens = await this.tokenService.generateTokens({ username, email });
    await this.cookieService.setBatchOfCookies(response, tokens, this.securityConfig.tokenPrefix);

    return tokens;
  }
}
