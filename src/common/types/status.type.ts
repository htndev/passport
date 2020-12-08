import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatusType {
  @Field(() => Int)
  status: number;

  @Field({ nullable: true })
  message?: string;
}
