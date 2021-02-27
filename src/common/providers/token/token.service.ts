import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseUserJwtPayload, JwtPayload } from '@xbeat/server-toolkit';

import { Microservice, MICROSERVICES } from '../../constants/microservice.constant';
import { MicroserviceToken } from '../../constants/type.constant';
import { SecurityConfig } from '../../providers/config/security.config';
import { reduceAsync } from '../../utils/async-iterators.util';

@Injectable()
export class TokenService {
  readonly #logger = new Logger('Token Service');

  constructor(private readonly jwtService: JwtService, private readonly securityConfig: SecurityConfig) {}

  async generateTokens(user: BaseUserJwtPayload): Promise<Required<MicroserviceToken>> {
    this.#logger.verbose(`Generating tokens for ${user.email}`);
    const tokens: Required<MicroserviceToken> = await reduceAsync(
      MICROSERVICES,
      async (acc: any, microservice: Microservice) => ({
        ...(await acc),
        ...(await this.generateToken(microservice, user))
      }),
      {} as any
    );

    return tokens;
  }

  async generateToken(microserivce: Microservice, user: BaseUserJwtPayload): Promise<MicroserviceToken> {
    const payload = {
      ...user,
      scope: microserivce
    };

    return {
      [microserivce]: await this.jwtService.signAsync(payload, {
        secret: this.securityConfig.getMicroserviceToken(microserivce)
      })
    };
  }

  async parseToken(token: string, secret: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret
    });
  }

  async generateRefreshToken(user: BaseUserJwtPayload): Promise<any> {
    return this.jwtService.signAsync(user, {
      secret: this.securityConfig.jwtRefreshTokenSecret,
      expiresIn: this.securityConfig.jwtRefreshTokenExpiresIn
    });
  }
}
