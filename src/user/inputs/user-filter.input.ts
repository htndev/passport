import { Field, InputType } from '@nestjs/graphql';

const OPTIONS = { nullable: true };

@InputType({ description: 'Fields for searching user' })
export class UserFilterInput {
  @Field(OPTIONS)
  skip: number;

  @Field(OPTIONS)
  limit: number;
}
