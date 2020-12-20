import { Field, FieldOptions, InputType, Int } from '@nestjs/graphql';

const OPTIONS: FieldOptions = {
  nullable: true
};

@InputType()
export class LocationFilterInput {
  @Field(() => Int, OPTIONS)
  skip?: number;

  @Field(() => Int, OPTIONS)
  limit?: number;
}
