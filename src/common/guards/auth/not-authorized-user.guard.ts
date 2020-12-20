import { CanActivate, ConflictException, ExecutionContext, Inject } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ErrorMessage } from '../../../common/constants';
import { CookieService } from '../../providers/cookie/cookie.service';

export class NotAuthorizedUser implements CanActivate {
  constructor(@Inject('CookieService') private readonly cookieService: CookieService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = GqlExecutionContext.create(context).getContext().req;
    const uuid = this.cookieService.getUuid(request.signedCookies);

    if (uuid) {
      throw new ConflictException(ErrorMessage.UserAuthorized);
    }

    return true;
  }
}
