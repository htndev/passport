import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserPreferencesRepository } from '../repositories/user-preferences.repository';
import { UserRepository } from './../repositories/user.repository';
import { PreferencesResolver } from './preferences.resolver';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferencesRepository, UserRepository])],
  providers: [PreferencesService, PreferencesResolver]
})
export class PreferencesModule {}
