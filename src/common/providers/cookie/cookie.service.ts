import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';

import { Nullable } from '../../utils/types';
import { Microservice, UUID } from './../../constants';
import { Cookies, CookieSetterFunction } from './../../utils/types';

type MicroServiceTokenTuple = [Microservice, string];

@Injectable()
export class CookieService {
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
