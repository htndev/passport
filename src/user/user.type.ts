import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  avatar: string;
}
