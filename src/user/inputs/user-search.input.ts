import { Field, InputType } from '@nestjs/graphql';

const OPTIONS = { nullable: true };

@InputType({ description: 'Fields for searching user' })
export class UserSearchInput {
  @Field(OPTIONS)
  username: string;

  @Field(OPTIONS)
  email: string;

  @Field(OPTIONS)
  locationId: number;
}
