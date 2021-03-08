import { Language } from './../common/constants/languages.constant';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GraphQLJwtGuard, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { PreferencesService } from './preferences.service';
import { AvailableLanguages } from './types/available-languages.type';
import { UserPreferencesType } from './types/user-preferences.type';

@UseGuards(GraphQLJwtGuard)
@Resolver(() => UserPreferencesType)
export class PreferencesResolver {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Mutation(() => StatusType)
  async changeLanguage(
    @CurrentUser('graphql') user: UserJwtPayload,
    @Args('language') language: Language
  ): Promise<StatusType> {
    return this.preferencesService.changeLanguage(user.id, language);
  }

  @Query(() => AvailableLanguages)
  async availableLanguages(): Promise<AvailableLanguages> {
    return {
      languages: this.preferencesService.availableLanguages
    };
  }

  @Query(() => UserPreferencesType)
  async getPreferences(@CurrentUser('graphql') user: UserJwtPayload): Promise<UserPreferencesType> {
    return this.preferencesService.getPreferences(user.id);
  }
}
