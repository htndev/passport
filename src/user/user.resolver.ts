import { Args, Query, Resolver } from '@nestjs/graphql';

import { UserType } from '../common/types/user.type';
import { UserService } from './user.service';

@Resolver((of) => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => UserType)
  async user(@Args('username') username: string): Promise<any> {
    const user = await this.userService.getUser(username);

    return user;
  }

  @Query((returns) => [UserType])
  async users(@Args('username') username: string): Promise<any> {
    return this.userService.getUsers(username);
  }
}
