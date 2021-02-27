import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExistsType, StatusType } from '@xbeat/server-toolkit';

import { CookieSetterFunction } from '../common/constants/type.constant';
import { CookieSetter } from '../common/decorators/cookie-setter.decorator';
import { GetUuid } from '../common/decorators/get-uuid.decorator';
import { NotAuthorizedUserGuard } from '../common/guards/auth/not-authorized-user.guard';
import { HasUuidGuard } from '../common/guards/token/has-uuid.guard';
import { AuthService } from './auth.service';
import { NewUserInput } from './inputs/new-user.input';
import { RequestResetPasswordInput } from './inputs/request-reset-password.input';
import { ResendConfirmationEmailInput } from './inputs/resend-confirmation-email.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { EmailConfirmedType } from './types/email-confirmed.type';
import { IsAuthorizedType } from './types/is-authorized.type';

@Resolver(() => StatusType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NotAuthorizedUserGuard)
  @Mutation(() => StatusType)
  async signUp(@Args('user') user: NewUserInput): Promise<StatusType> {
    return this.authService.signUp(user);
  }

  @Mutation(() => StatusType)
  async resendConfirmationEmail(@Args('to') to: ResendConfirmationEmailInput): Promise<StatusType> {
    return this.authService.resendConfirmationEmail(to);
  }

  @Mutation(() => StatusType)
  async confirmEmail(@Args('token') token: string): Promise<StatusType> {
    return this.authService.confirmEmail(token);
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
  async generatePasswordResetToken(
    @Args('resetPasswordInput') resetPasswordInput: RequestResetPasswordInput
  ): Promise<StatusType> {
    return this.authService.generatePasswordResetToken(resetPasswordInput);
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

  @Query(() => EmailConfirmedType)
  async isUserEmailConfirmed(@Args('email') email: string): Promise<EmailConfirmedType> {
    return this.authService.isUserEmailConfirmed(email);
  }

  @Query(() => ExistsType)
  async isPasswordResetTokenExists(@Args('token') token: string): Promise<ExistsType> {
    return this.authService.isPasswordResetTokenExists(token);
  }

  @Mutation(() => StatusType)
  async resetPassword(@Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput): Promise<StatusType> {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
