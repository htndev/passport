import { ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

import { LocationInfo } from '../common/constants/type.constant';

@ObjectType()
export class LocationType implements LocationInfo {
  @OptionalField()
  country: string;

  @OptionalField()
  code: string;

  @OptionalField()
  city: string;

  @OptionalField()
  region: string;
}
