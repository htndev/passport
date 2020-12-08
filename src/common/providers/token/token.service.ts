import { JwtPayload } from './../../../auth/interface/jwt-payload.interface';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserJwtPayload } from '../../../auth/interface/jwt-payload.interface';
import { Microservice, MICROSERVICES } from '../../../common/constants';
import { SecurityConfig } from '../../providers/config/security.config';
import { MicroserviceToken } from '../../utils/types';

@Injectable()
export class TokenService {
  readonly #logger = new Logger('Token Service');

  constructor(private readonly jwtService: JwtService, private readonly securityConfig: SecurityConfig) {}

  async generateTokens(user: UserJwtPayload): Promise<Required<MicroserviceToken>> {
    this.#logger.verbose(`Generating tokens for ${user.email}`);

    const tokens = MICROSERVICES.reduce(
      async (acc: any, microservice: Microservice) => ({
        ...(await acc),
        ...(await this.generateToken(microservice, user))
      }),
      Promise.resolve({} as MicroserviceToken)
    );

    return tokens;
  }

  async generateToken(microserivce: Microservice, user: UserJwtPayload): Promise<MicroserviceToken> {
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

  async generateRefreshToken(user: UserJwtPayload): Promise<any> {
    return this.jwtService.signAsync(user, {
      secret: this.securityConfig.jwtRefreshTokenSecret,
      expiresIn: this.securityConfig.jwtRefreshTokenExpiresIn
    });
  }
}
