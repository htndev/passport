import { EntityRepository, Repository } from 'typeorm';

import { LocationInfo } from '../common/utils/types';
import { Location } from '../entities/location.entity';

@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {
  private async findLocation({ city, code, country, region }: LocationInfo): Promise<any> {
    const query = this.createQueryBuilder('location');

    query
      .where('city = :city', { city })
      .andWhere('code = :code', { code })
      .andWhere('country = :country', { country })
      .andWhere('region = :region', { region });

    return await query.getOne();
  }

  async getOrInsertLocation(location: LocationInfo): Promise<Location> {
    const foundLocation = await this.findLocation(location);

    if (foundLocation) {
      return foundLocation;
    }

    const newLocation = new Location();

    newLocation.country = location.country;
    newLocation.code = location.code;
    newLocation.region = location.region;
    newLocation.city = location.city;

    await newLocation.save();

    return newLocation;
  }
}
