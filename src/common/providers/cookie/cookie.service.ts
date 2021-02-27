import { Injectable } from '@nestjs/common';
import { AppConfig } from '@xbeat/server-toolkit';
import { Nullable } from '@xbeat/toolkit';
import { CookieOptions } from 'express';

import { UUID } from '../../constants/common.constant';
import { Cookies, CookieSetterFunction } from '../../constants/type.constant';

@Injectable()
export class CookieService {
  constructor(private readonly appConfig: AppConfig) {}

  private get cookieOptions(): CookieOptions {
    return {
      sameSite: 'lax',
      httpOnly: true,
      signed: true,
      domain: this.appConfig.appHostname,
      path: '/'
    };
  }

  setCookie(cookieSetter: CookieSetterFunction, key: string, value: string | number, expires = new Date()): void {
    cookieSetter(key, value, {
      ...this.cookieOptions,
      expires
    });
  }

  getCookie(cookies: Cookies, key: string): Nullable<string> {
    return cookies[key] ?? '';
  }

  deleteCookie(cookieSetter: CookieSetterFunction, key: string): void {
    cookieSetter(key, '', {
      ...this.cookieOptions,
      expires: new Date(),
      maxAge: -1
    });
  }

  getUuid(cookies: Cookies): Nullable<string> {
    return this.getCookie(cookies, UUID);
  }
}
