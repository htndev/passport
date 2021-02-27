import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';

@InputType({ description: 'Fields for searching user' })
export class UserFilterInput {
  @OptionalField()
  skip: number;

  @OptionalField()
  limit: number;
}
