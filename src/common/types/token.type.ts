import { Field, ObjectType } from '@nestjs/graphql';

import { Microservice } from '../constants';

@ObjectType()
export class TokenType {
  @Field({ nullable: true })
  [Microservice.MEDIA]: string;

  @Field({ nullable: true })
  [Microservice.PASSPORT]: string;

  @Field({ nullable: true })
  [Microservice.STUDIO]: string;
}
