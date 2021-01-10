import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Maybe } from '../common/constants/type.constant';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from '../common/guards/auth/jwt.guard';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { LocationService } from '../location/location.service';
import { LocationType } from '../location/location.type';
import { StatusType } from '../common/types/status.type';
import { UserSearchInput } from './inputs/user-search.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@UseGuards(JwtGuard)
@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly locationService: LocationService) {}

  @Mutation(() => StatusType)
  async updateAvatar(
    @Args('avatar', { nullable: false }) avatar: string,
    @CurrentUser() user: UserType
  ): Promise<StatusType> {
    return this.userService.updateUserAvatar(avatar, user);
  }

  @Query(() => UserType)
  async user(@Args('username') username: string): Promise<any> {
    return this.userService.getUser(username);
  }

  @Query(() => [UserType])
  async users(@Args('searchCriteria', { nullable: true }) searchCriteria: UserSearchInput): Promise<UserType[]> {
    return this.userService.getUsers(searchCriteria);
  }

  @Query(() => UserType)
  async me(@CurrentUser() user: UserType): Promise<Omit<User, 'password'>> {
    return this.userService.getUser(user.username);
  }

  @ResolveField(() => LocationType)
  async location(@Parent() user: User): Promise<Maybe<Location>> {
    return this.locationService.getLocationById(user.locationId);
  }
}
