import { LocationFilterInput } from './inputs/location-filter.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Location } from './../entities/location.entity';
import { LocationRepository } from './../repositories/location.repository';
import { LocationSearchInput } from './inputs/location-search.input';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(LocationRepository) private readonly locationRepository: LocationRepository) {}

  async getLocations(searchInput: LocationSearchInput, filters: LocationFilterInput): Promise<Location[]> {
    return this.locationRepository.findLocation(searchInput, filters);
  }
}
