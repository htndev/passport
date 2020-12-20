import { Args, Query, Resolver } from '@nestjs/graphql';

import { LocationFilterInput } from './inputs/location-filter.input';
import { LocationSearchInput } from './inputs/location-search.input';
import { LocationService } from './location.service';
import { LocationType } from './location.type';

@Resolver(LocationType)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}
  @Query(() => [LocationType], { nullable: true })
  async getLocations(
    @Args('searchLocationInput', { nullable: true }) searchLocationInput: LocationSearchInput,
    @Args('filters', { nullable: true, defaultValue: { skip: 0 } }) filters: LocationFilterInput
  ): Promise<LocationType[]> {
    return this.locationService.getLocations(searchLocationInput, filters);
  }
}
