import { LocationInfo } from './../common/utils/types';
import { Field, ObjectType } from '@nestjs/graphql';

const OPTIONS = { nullable: true };

@ObjectType()
export class LocationType implements LocationInfo {
  @Field(OPTIONS)
  country: string;

  @Field(OPTIONS)
  code: string;

  @Field(OPTIONS)
  city: string;

  @Field(OPTIONS)
  region: string;
}
