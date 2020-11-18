import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { CookieService } from '../../../common/providers/cookie/cookie.service';

@Injectable()
export class HasRefreshTokenGuard implements CanActivate {
  constructor(@Inject('CookieService') private readonly cookieService: CookieService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const refreshToken = this.cookieService.getRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
