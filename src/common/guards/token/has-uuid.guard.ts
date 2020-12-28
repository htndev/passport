import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

import { REFRESH_TOKEN } from '../../constants';
import { CookieService } from '../../providers/cookie/cookie.service';
import { RedisWrapperService } from '../../providers/redis-wrapper/redis-wrapper.service';

@Injectable()
export class HasUuidGuard implements CanActivate {
  constructor(
    @Inject('CookieService') private readonly cookieService: CookieService,
    @Inject('RedisWrapperService') private readonly redisWrapperService: RedisWrapperService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = GqlExecutionContext.create(context).getContext().req;
    const uuid = this.cookieService.getUuid(request.signedCookies);

    if (!uuid) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.redisWrapperService.getToken(uuid, REFRESH_TOKEN);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
