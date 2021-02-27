import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@InputType({ description: 'Fields for searching user' })
export class UserSearchInput {
  @OptionalField()
  username: string;

  @OptionalField()
  email: string;

  @OptionalField()
  locationId: number;
}
