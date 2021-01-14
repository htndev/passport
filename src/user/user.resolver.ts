import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Maybe } from '../common/constants/type.constant';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from '../common/guards/auth/jwt.guard';
import { StatusType } from '../common/types/status.type';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { LocationService } from '../location/location.service';
import { LocationType } from '../location/location.type';
import { ExistsType } from '../common/types/exists.type';
import { ExistsUserInput } from './inputs/exists-user.input';
import { UserSearchInput } from './inputs/user-search.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly locationService: LocationService) {}

  @UseGuards(JwtGuard)
  @Mutation(() => StatusType)
  async updateAvatar(
    @Args('avatar', { nullable: false }) avatar: string,
    @CurrentUser() user: UserType
  ): Promise<StatusType> {
    return this.userService.updateUserAvatar(avatar, user);
  }

  @Query(() => ExistsType)
  async userExists(@Args('search') search: ExistsUserInput): Promise<any> {
    return this.userService.userExists(search);
  }

  @UseGuards(JwtGuard)
  @Query(() => UserType)
  async user(@Args('username') username: string): Promise<any> {
    return this.userService.getUser(username);
  }

  @UseGuards(JwtGuard)
  @Query(() => [UserType])
  async users(@Args('searchCriteria', { nullable: true }) searchCriteria: UserSearchInput): Promise<UserType[]> {
    return this.userService.getUsers(searchCriteria);
  }

  @UseGuards(JwtGuard)
  @Query(() => UserType)
  async me(@CurrentUser() user: UserType): Promise<Omit<User, 'password'>> {
    return this.userService.getUser(user.username);
  }

  @ResolveField(() => LocationType)
  async location(@Parent() user: User): Promise<Maybe<Location>> {
    return this.locationService.getLocationById(user.locationId);
  }
}
