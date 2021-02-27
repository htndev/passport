import { ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

import { Microservice } from '../common/constants/microservice.constant';

@ObjectType()
export class TokenType {
  @OptionalField()
  [Microservice.MEDIA]?: string;

  @OptionalField()
  [Microservice.PASSPORT]?: string;

  @OptionalField()
  [Microservice.STUDIO]?: string;
}
