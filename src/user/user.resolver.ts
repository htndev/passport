import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExistsType, GraphQLJwtGuard, StatusType } from '@xbeat/server-toolkit';
import { Maybe } from '@xbeat/toolkit';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { LocationService } from '../location/location.service';
import { LocationType } from '../location/location.type';
import { ExistsUserInput } from './inputs/exists-user.input';
import { UpdateUserInfoInput } from './inputs/update-user-info.input';
import { UserSearchInput } from './inputs/user-search.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly locationService: LocationService) {}

  @UseGuards(GraphQLJwtGuard)
  @Mutation(() => StatusType)
  async updateAvatar(
    @Args('avatar', { nullable: false }) avatar: string,
    @CurrentUser() user: UserType
  ): Promise<StatusType> {
    return this.userService.updateUserAvatar(avatar, user);
  }

  @UseGuards(GraphQLJwtGuard)
  @Mutation(() => StatusType)
  async updateUserInfo(@Args('updateUserInfoInput') userInfo: UpdateUserInfoInput): Promise<StatusType> {
    // console.log(userInfo);
    return {
      status: 200
    };
  }

  @Query(() => ExistsType)
  async userExists(@Args('search') search: ExistsUserInput): Promise<ExistsType> {
    return this.userService.userExists(search);
  }

  @UseGuards(GraphQLJwtGuard)
  @Query(() => UserType)
  async user(@Args('username') username: string): Promise<User> {
    return this.userService.getUser(username);
  }

  @UseGuards(GraphQLJwtGuard)
  @Query(() => [UserType])
  async users(@Args('searchCriteria', { nullable: true }) searchCriteria: UserSearchInput): Promise<UserType[]> {
    return this.userService.getUsers(searchCriteria);
  }

  @UseGuards(GraphQLJwtGuard)
  @Query(() => UserType)
  async me(@CurrentUser() user: UserType): Promise<Omit<User, 'password'>> {
    return this.userService.getUser(user.username);
  }

  @ResolveField(() => LocationType)
  async location(@Parent() user: User): Promise<Maybe<Location>> {
    return this.locationService.getLocationById(user.locationId);
  }
}
