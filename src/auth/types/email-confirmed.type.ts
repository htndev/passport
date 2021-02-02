import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'API response, that user email confirmed or not' })
export class EmailConfirmedType {
  @Field()
  confirmed: boolean;
}
