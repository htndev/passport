import { CanActivate, ConflictException, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ErrorMessage } from '../../../common/constants';
import { CookieService } from '../../providers/cookie/cookie.service';

export class NotAuthorizedUser implements CanActivate {
  constructor(@Inject('CookieService') private readonly cookieService: CookieService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = this.cookieService.getRefreshToken(request);

    if (refreshToken) {
      throw new ConflictException(ErrorMessage.UserAuthorized);
    }

    return true as boolean;
  }
}
