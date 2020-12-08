import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CookieSetter } from '../common/decorators/cookie-setter.decorator';
import { StatusType } from '../common/types/status.type';
import { CookieSetterFunction } from '../common/utils/types';
import { AuthService } from './auth.service';
import { NewUserInput } from './inputs/new-user.input';
import { SignInUserInput } from './inputs/sign-in-user.input';

@Resolver(of => StatusType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => StatusType)
  async signUp(
    @Args('user') user: NewUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signUp(user, cookieSetter);
  }

  @Mutation(returns => StatusType)
  async signIn(
    @Args('user') user: SignInUserInput,
    @CookieSetter() cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    return this.authService.signIn(user, cookieSetter);
  }

  @Mutation(returns => StatusType)
  async logout(@CookieSetter() cookieSetter: CookieSetterFunction): Promise<StatusType> {
    return this.authService.logout(cookieSetter);
  }
}
