import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';

import { MicroserviceToken, Nullable } from '../../utils/types';
import { SecurityConfig } from '../config/security.config';
import { DateService } from '../date/date.service';
import { TokenService } from '../token/token.service';
import { Microservice, REFRESH_TOKEN_COOKIE } from './../../constants';
import { CookieSetterFunction } from './../../utils/types';

type MicroServiceTokenTuple = [Microservice, string];

@Injectable()
export class CookieService {
  constructor(
    private readonly securityConfig: SecurityConfig,
    private readonly tokenService: TokenService,
    private readonly dateService: DateService
  ) {}

  private readonly cookieOptions: CookieOptions = {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    signed: true
  };

  setCookie(cookieSetter: CookieSetterFunction, key: string, value: string | number, expires = new Date()): void {
    cookieSetter(key, value, {
      ...this.cookieOptions,
      expires
    });
  }

  async setBatchOfCookies(cookieSetter: CookieSetterFunction, tokens: Required<MicroserviceToken>): Promise<void> {
    await Promise.all(
      Object.entries(tokens).map(async ([microservice, token]: MicroServiceTokenTuple) => {
        const secret = this.securityConfig.getMicroserviceToken(microservice);
        const { exp, scope } = await this.tokenService.parseToken(token, secret);

        this.setCookie(cookieSetter, scope, token, this.dateService.timestampToDate(exp));
      })
    );
  }

  getCookie(cookies: Record<string, any>, key: string): Nullable<string> {
    return cookies[key] ?? '';
  }

  deleteCookie(cookieSetter: CookieSetterFunction, key: string): void {
    cookieSetter(key, '', {
      ...this.cookieOptions,
      expires: new Date(),
      maxAge: -1
    });
  }

  getRefreshToken(cookies: Record<string, any>): string {
    return this.getCookie(cookies, REFRESH_TOKEN_COOKIE);
  }
}
