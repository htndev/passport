import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { CookieSetterFunction } from '../common/constants/type.constant';
import { CookieSetter } from '../common/decorators/cookie-setter.decorator';
import { GetUuid } from '../common/decorators/get-uuid.decorator';
import { NotAuthorizedUser } from '../common/guards/auth/not-authorized-user.guard';
import { HasUuidGuard } from '../common/guards/token/has-uuid.guard';
import { StatusType } from '../common/types/status.type';
import { IsAuthorizedType } from '../common/types/is-authorized.type';
import { AuthService } from './auth.service';
import { NewUserInput } from './inputs/new-user.input';
import { SignInUserInput } from './inputs/sign-in-user.input';

@Resolver(() => StatusType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NotAuthorizedUser)
  @Mutation(() => StatusType)
  async signUp(
    @Args('user') user: NewUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signUp(user, cookieSetter);
  }

  @UseGuards(NotAuthorizedUser)
  @Mutation(() => StatusType)
  async signIn(
    @Args('user') user: SignInUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signIn(user, cookieSetter);
  }

  @UseGuards(HasUuidGuard)
  @Mutation(() => StatusType)
  async logout(@CookieSetter() cookieSetter: CookieSetterFunction, @GetUuid() uuid: string): Promise<StatusType> {
    return this.authService.logout(uuid, cookieSetter);
  }

  @Query(() => IsAuthorizedType)
  isAuthorized(@GetUuid() uuid: string): IsAuthorizedType {
    return this.authService.isAuthorized(uuid);
  }
}
