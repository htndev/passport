import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { LocationRepository } from './../repositories/location.repository';
import { UserRepository } from './../repositories/user.repository';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, LocationRepository])],
  providers: [LocationService, UserService, LocationResolver]
})
export class LocationModule {}
