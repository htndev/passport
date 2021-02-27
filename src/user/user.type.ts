import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;

  @OptionalField()
  avatar: string;
}
