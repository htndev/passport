import { REFRESH_COOKIE } from './../../constants';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { SecurityConfig } from '../../../common/providers/config/security.config';
import { CookieService } from '../../../common/providers/cookie/cookie.service';

@Injectable()
export class HasRefreshTokenGuard implements CanActivate {
  constructor(private readonly securityConfig: SecurityConfig, private readonly cookieService: CookieService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const refreshToken = this.cookieService.getCookie(request, `${this.securityConfig.tokenPrefix}${REFRESH_COOKIE}`);

    if(!refreshToken) {
      throw new UnauthorizedException();
    }

    return true;
  }
}