import { Injectable } from '@nestjs/common';
import { buildFieldLabels } from 'src/common/utils/build-field-labels';
import { EntityRepository, Repository } from 'typeorm';

import { LocationInfo, Nullable } from '../common/utils/types';
import { Location } from '../entities/location.entity';
import { isNil } from './../common/utils/object';
import { LocationFilterInput } from './../location/inputs/location-filter.input';

type AllowedFields = keyof (LocationInfo & { id: number });

@Injectable()
@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {
  readonly #label = 'location';

  async findLocation(
    { city, code, country, region }: LocationInfo = {},
    { skip, limit }: LocationFilterInput = { skip: 0 }
  ): Promise<Location[]> {
    if (!isNil(limit) && limit <= 0) {
      return [];
    }

    const query = this.createQueryBuilder(this.#label).select(
      buildFieldLabels<AllowedFields>(this.#label, ['id', 'city', 'code', 'country', 'region'])
    );

    if (city) {
      query.where('city = :city', { city });
    }

    if (code) {
      query.andWhere('code = :code', { code });
    }

    if (country) {
      query.andWhere('country = :country', { country });
    }

    if (region) {
      query.andWhere('region = :region', { region });
    }

    if (skip) {
      query.skip(skip);
    }

    if (!isNil(limit)) {
      query.limit(limit);
    }

    return query.getMany();
  }

  async getOrInsertLocation(location: LocationInfo): Promise<Location> {
    const foundLocation = await this.findLocation(location);

    if (foundLocation.length) {
      return foundLocation[0];
    }

    const newLocation = new Location();

    newLocation.country = location.country;
    newLocation.code = location.code;
    newLocation.region = location.region;
    newLocation.city = location.city;

    await newLocation.save();

    return newLocation;
  }

  async findLocationById(id: number): Promise<Nullable<Location>> {
    return this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, ['id', 'country', 'code', 'region', 'city']))
      .where('id = :id', { id })
      .getOne();
  }
}
