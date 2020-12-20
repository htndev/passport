import { Field, InputType } from '@nestjs/graphql';

const OPTIONS = { nullable: true };

@InputType()
export class LocationSearchInput {
  @Field(OPTIONS)
  country?: string;

  @Field(OPTIONS)
  code?: string;

  @Field(OPTIONS)
  region?: string;

  @Field(OPTIONS)
  city?: string;
}
