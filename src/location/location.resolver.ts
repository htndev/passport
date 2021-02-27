import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLJwtGuard } from '@xbeat/server-toolkit';

import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { UserService } from '../user/user.service';
import { UserType } from '../user/user.type';
import { LocationFilterInput } from './inputs/location-filter.input';
import { LocationSearchInput } from './inputs/location-search.input';
import { LocationService } from './location.service';
import { LocationType } from './location.type';

@UseGuards(GraphQLJwtGuard)
@Resolver(LocationType)
export class LocationResolver {
  constructor(private readonly locationService: LocationService, private readonly userService: UserService) {}

  @Query(() => [LocationType], { nullable: true })
  async getLocations(
    @Args('searchLocationInput', { nullable: true }) searchLocationInput: LocationSearchInput,
    @Args('filters', { nullable: true, defaultValue: { skip: 0 } }) filters: LocationFilterInput
  ): Promise<LocationType[]> {
    return this.locationService.getLocations(searchLocationInput, filters);
  }

  @ResolveField(() => [UserType])
  async users(@Parent() location: Location): Promise<User[]> {
    return this.userService.getUsersByLocation(location.id);
  }
}
