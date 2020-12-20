import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationRepository } from './../repositories/location.repository';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository])],
  providers: [LocationService, LocationResolver]
})
export class LocationModule {}
