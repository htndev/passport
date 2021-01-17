import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('IsAuthorized')
export class IsAuthorizedType {
  @Field()
  isAuthorized: boolean;
}
