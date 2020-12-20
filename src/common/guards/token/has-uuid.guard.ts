import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { CookieService } from '../../providers/cookie/cookie.service';

@Injectable()
export class HasUuidGuard implements CanActivate {
  constructor(@Inject('CookieService') private readonly cookieService: CookieService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = GqlExecutionContext.create(context).getContext().req;
    const uuid = this.cookieService.getUuid(request.signedCookies);

    if (!uuid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
