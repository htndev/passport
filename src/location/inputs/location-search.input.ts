import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@InputType()
export class LocationSearchInput {
  @OptionalField()
  country?: string;

  @OptionalField()
  code?: string;

  @OptionalField()
  region?: string;

  @OptionalField()
  city?: string;
}
