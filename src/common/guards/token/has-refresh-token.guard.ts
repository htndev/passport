import { Response, Request } from 'express';
import { SecurityConfig } from '../../../common/providers/config/security.config';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class HasRefreshTokenGuard implements CanActivate {
  constructor(private readonly securityConfig: SecurityConfig) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies?.[`${this.securityConfig.tokenPrefix}refresh`];

    console.log(request.cookies);

    if(!refreshToken) {
      throw new UnauthorizedException({
        url: 'Authorize url'
      });
    }

    return true;
  }
}