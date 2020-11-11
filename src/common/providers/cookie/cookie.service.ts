import { TokenService } from './../token/token.service';
import { Microservice } from './../../constants';
import { MicroserviceToken } from '../../types';
import { SecurityConfig } from '../config/security.config';
import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';

type MicroServiceTokenTuple = [Microservice, string];

@Injectable()
export class CookieService {
  constructor(private readonly securityConfig: SecurityConfig, private readonly tokenService: TokenService) {}

  setCookie(response: Response, key: string, value: string | number): void {
    console.log({ key, value });
    // response.cookie(key, value, {
    //   sameSite: 'none',
    //   secure: false,
    //   expires: 3600
    // });
  }

  async setBatchOfCookies(res: Response, tokens: Required<MicroserviceToken>): Promise<void> {
    let tokensVerification: any = Object.entries(tokens).map(async ([microservice, token]: MicroServiceTokenTuple) => {
      const secret = this.securityConfig.getMicroserviceToken(microservice);
      const data = await this.tokenService.parseToken(token, secret);
      console.log(token, tokens[token]);
      return data;
    });

    tokensVerification = await Promise.all(tokensVerification);

    console.log(tokensVerification);
  }

  getCookie(request: Request, key: string): void {
    console.log(request.cookies);
  }
}
