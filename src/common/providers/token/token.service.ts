import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { reduceAsync } from 'src/common/utils/async-iterators';

import { Microservice, MICROSERVICES } from '../../../common/constants';
import { BaseUserJwtPayload, JwtPayload } from '../../interfaces/jwt-payload.interface';
import { SecurityConfig } from '../../providers/config/security.config';
import { MicroserviceToken } from '../../utils/types';
import { RedisWrapperService } from './../redis-wrapper/redis-wrapper.service';

@Injectable()
export class TokenService {
  readonly #logger = new Logger('Token Service');

  constructor(
    private readonly jwtService: JwtService,
    private readonly securityConfig: SecurityConfig,
    private readonly redisWrapperService: RedisWrapperService
  ) {}

  async generateTokens(user: BaseUserJwtPayload): Promise<Required<MicroserviceToken>> {
    this.#logger.verbose(`Generating tokens for ${user.email}`);
    const tokens: Required<MicroserviceToken> = await reduceAsync(
      MICROSERVICES,
      async (acc: any, microservice: Microservice) => ({
        ...(await acc),
        ...(await this.generateToken(microservice, user))
      }),
      {}
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
