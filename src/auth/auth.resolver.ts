import { GetUuid } from './../common/decorators/get-uuid.decorator';
import { Cookies } from './../common/utils/types';
import { HasUuidGuard } from '../common/guards/token/has-uuid.guard';
import { NotAuthorizedUser } from './../common/guards/auth/not-authorized-user.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CookieSetter } from '../common/decorators/cookie-setter.decorator';
import { StatusType } from '../common/types/status.type';
import { CookieSetterFunction } from '../common/utils/types';
import { AuthService } from './auth.service';
import { NewUserInput } from './inputs/new-user.input';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { CookieGetter } from 'src/common/decorators/cookie-getter.decorator';

@Resolver((of) => StatusType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NotAuthorizedUser)
  @Mutation((returns) => StatusType)
  async signUp(
    @Args('user') user: NewUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signUp(user, cookieSetter);
  }

  @UseGuards(NotAuthorizedUser)
  @Mutation((returns) => StatusType)
  async signIn(
    @Args('user') user: SignInUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signIn(user, cookieSetter);
  }

  @UseGuards(HasUuidGuard)
  @Mutation((returns) => StatusType)
  async logout(@CookieSetter() cookieSetter: CookieSetterFunction, @GetUuid() uuid: string): Promise<StatusType> {
    return this.authService.logout(uuid, cookieSetter);
  }
}
