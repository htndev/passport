import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from './../common/guards/auth/jwt.guard';
import { UserSearchInput } from './inputs/user-search.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@UseGuards(JwtGuard)
@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  async user(@Args('username') username: string): Promise<any> {
    const user = await this.userService.getUser(username);

    return user;
  }

  @Query(() => [UserType])
  async users(@Args('searchCriteria') searchCriteria: UserSearchInput): Promise<UserType[]> {
    return this.userService.getUsers(searchCriteria);
  }

  @Query(() => UserType)
  async me(@CurrentUser() user: Record<string, any>): Promise<UserType> {
    // return this.userService.getUser(user.username);
    console.log(user);
    return {
      id: 1,
      email: 'qweqweqwe',
      username: 'qwe',
      locationId: 1
    };
  }
}
