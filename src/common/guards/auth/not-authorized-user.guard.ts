import { CanActivate, ConflictException, ExecutionContext, Inject } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ErrorMessage, UUID } from '../../../common/constants';
import { REFRESH_TOKEN } from '../../constants';
import { CookieService } from '../../providers/cookie/cookie.service';
import { RedisWrapperService } from '../../providers/redis-wrapper/redis-wrapper.service';
import { getBindContext } from '../../utils/cookie-context-binder.util';

export class NotAuthorizedUser implements CanActivate {
  constructor(
    @Inject('CookieService') private readonly cookieService: CookieService,
    @Inject('RedisWrapperService') private readonly redisWrapperService: RedisWrapperService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const _ctx = GqlExecutionContext.create(context).getContext();
    const ctx = getBindContext(_ctx);

    const request = ctx.req;
    const response = ctx.res;

    const uuid = this.cookieService.getUuid(request.signedCookies);

    if (!uuid) {
      return true;
    }

    const refreshToken = await this.redisWrapperService.getToken(uuid, REFRESH_TOKEN);
    if (refreshToken) {
      throw new ConflictException(ErrorMessage.UserAuthorized);
    }

    this.cookieService.deleteCookie(response.cookie, UUID);

    return true;
  }
}
