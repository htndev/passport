import { Field, ObjectType } from '@nestjs/graphql';

import { Microservice } from '../common/constants';

const OPTIONS = { nullable: true };

@ObjectType()
export class TokenType {
  @Field(OPTIONS)
  [Microservice.MEDIA]?: string;

  @Field(OPTIONS)
  [Microservice.PASSPORT]?: string;

  @Field(OPTIONS)
  [Microservice.STUDIO]?: string;
}
