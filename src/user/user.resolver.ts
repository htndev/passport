import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from './../common/guards/auth/jwt.guard';
import { Location } from './../entities/location.entity';
import { User } from './../entities/user.entity';
import { LocationService } from './../location/location.service';
import { LocationType } from './../location/location.type';
import { UserSearchInput } from './inputs/user-search.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@UseGuards(JwtGuard)
@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly locationService: LocationService) {}

  @Query(() => UserType)
  async user(@Args('username') username: string): Promise<any> {
    const user = await this.userService.getUser(username);

    return user;
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
  async location(@Parent() user: User): Promise<Location> {
    return this.locationService.getLocationById(user.locationId);
  }
}
