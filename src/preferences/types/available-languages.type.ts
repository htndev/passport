import { Field, ObjectType } from '@nestjs/graphql';

import { Language } from '../../common/constants/languages.constant';

@ObjectType()
export class AvailableLanguages {
  @Field(() => [String])
  languages: Language[];
}
