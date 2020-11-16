import { TokenService } from '../token/token.service';
import { Microservice } from './../../constants';
import { MicroserviceToken } from '../../types';
import { SecurityConfig } from '../config/security.config';
import { CookieOptions, Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { DateService } from '../date/date.service';

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

  setCookie(response: Response, key: string, value: string | number, expires = new Date()): void {
    response.cookie(key, value, {
      ...this.cookieOptions,
      expires
    });
  }

  async setBatchOfCookies(res: Response, tokens: Required<MicroserviceToken>, prefix = ''): Promise<void> {
    await Promise.all(
      Object.entries(tokens).map(async ([microservice, token]: MicroServiceTokenTuple) => {
        const secret = this.securityConfig.getMicroserviceToken(microservice);
        const { exp, scope } = await this.tokenService.parseToken(token, secret);
        const key = `${prefix}${scope}`;
        this.setCookie(res, key, token, this.dateService.timestampToDate(exp));
      })
    );
  }

  getCookie(request: Request, key: string): string | null {
    const cookie = request.signedCookies[key];

    return cookie ?? null;
  }

  deleteCookie(response: Response, key: string): void {
    response.cookie(key, '', {
      ...this.cookieOptions,
      expires: new Date(),
      maxAge: -1
    });
  }
}
