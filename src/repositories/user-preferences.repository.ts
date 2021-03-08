import { Language } from '../common/constants/languages.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { UserPreferences } from '../entities/user-preferences.entity';

@Injectable()
@EntityRepository(UserPreferences)
export class UserPreferencesRepository extends Repository<UserPreferences> {
  private readonly label = 'preferences';

  async updateLanguage(id: number, language: Language): Promise<UserPreferences> {
    const preferences = await this.findOne({ id });

    if (!preferences) {
      throw new NotFoundException('Preferences not found');
    }

    preferences.language = language;

    return preferences.save();
  }
}
