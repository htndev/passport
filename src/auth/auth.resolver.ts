import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CookieSetterFunction } from '../common/constants/type.constant';
import { CookieSetter } from '../common/decorators/cookie-setter.decorator';
import { GetUuid } from '../common/decorators/get-uuid.decorator';
import { NotAuthorizedUserGuard } from '../common/guards/auth/not-authorized-user.guard';
import { HasUuidGuard } from '../common/guards/token/has-uuid.guard';
import { StatusType } from '../common/types/status.type';
import { ExistsType } from '../common/types/exists.type';
import { AuthService } from './auth.service';
import { NewUserInput } from './inputs/new-user.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { IsAuthorizedType } from './types/is-authorized.type';

@Resolver(() => StatusType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NotAuthorizedUserGuard)
  @Mutation(() => StatusType)
  async signUp(
    @Args('user') user: NewUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signUp(user, cookieSetter);
  }

  @UseGuards(NotAuthorizedUserGuard)
  @Mutation(() => StatusType)
  async signIn(
    @Args('user') user: SignInUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signIn(user, cookieSetter);
  }

  @UseGuards(NotAuthorizedUserGuard)
  @Mutation(() => StatusType)
  async generatePasswordResetToken(@Args('email') email: string): Promise<StatusType> {
    return this.authService.generatePasswordResetToken(email);
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

  @Query(() => ExistsType)
  async isTokenExists(@Args('token') token: string): Promise<ExistsType> {
    return this.authService.isTokenExists(token);
  }

  @Mutation(() => StatusType)
  async resetPassword(@Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput): Promise<StatusType> {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
