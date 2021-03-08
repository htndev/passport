import { Injectable, NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from '@xbeat/server-toolkit';
import { UserPreferences } from 'src/entities/user-preferences.entity';

import { ALLOWED_LANGUAGES, Language } from '../common/constants/languages.constant';
import { UserPreferencesRepository } from '../repositories/user-preferences.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserPreferencesType } from './types/user-preferences.type';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreferencesRepository) private readonly userPreferencesRepository: UserPreferencesRepository,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository
  ) {}

  get availableLanguages(): Language[] {
    return ALLOWED_LANGUAGES;
  }

  async getPreferences(userId: number): Promise<UserPreferencesType> {
    const preferences = await this.findUserPreferences(userId);

    return {
      language: preferences.language
    };
  }

  async changeLanguage(userId: number, language: Language): Promise<StatusType> {
    if (!this.availableLanguages.includes(language)) {
      throw new BadRequestException(
        `Language '${language}' is not supporting. Supported languages: ${this.availableLanguages.join(', ')}`
      );
    }

    const preferences = await this.findUserPreferences(userId);
    preferences.language = language;
    await preferences.save();

    return {
      status: HttpStatus.ACCEPTED
    };
  }

  private async findUserPreferences(id: number): Promise<UserPreferences> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('Current user not found');
    }

    const preferences = await this.userPreferencesRepository.findOne({ id: user.preferencesId });

    if (!preferences) {
      throw new NotFoundException('Preferences for current user not found');
    }

    return preferences;
  }
}
