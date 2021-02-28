import { ObjectType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { ApiEndpoint } from '@xbeat/toolkit';

@ObjectType()
export class TokenType {
  @OptionalField()
  [ApiEndpoint.Media]?: string;

  @OptionalField()
  [ApiEndpoint.Passport]?: string;

  @OptionalField()
  [ApiEndpoint.Studio]?: string;
}
