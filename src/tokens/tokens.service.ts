import { SecurityConfig } from '../common/providers/config/security.config';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { TokenService } from '../common/providers/token/token.service';

@Injectable()
export class TokensService {
  constructor(private readonly tokenService: TokenService, private readonly securityConfig: SecurityConfig) {}

  async getTokens(request: Request): Promise<any> {
    // console.log(request.cookies);
    return {};
  }
}
