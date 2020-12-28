import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Location } from './../entities/location.entity';
import { LocationRepository } from './../repositories/location.repository';
import { UserRepository } from './../repositories/user.repository';
import { LocationFilterInput } from './inputs/location-filter.input';
import { LocationSearchInput } from './inputs/location-search.input';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationRepository) private readonly locationRepository: LocationRepository,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository
  ) {}

  async getLocations(searchInput: LocationSearchInput, filters: LocationFilterInput): Promise<Location[]> {
    return this.locationRepository.findLocation(searchInput, filters);
  }

  async getLocationById(id: number): Promise<Location> {
    return this.locationRepository.findLocationById(id);
  }
}
