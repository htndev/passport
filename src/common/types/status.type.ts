import { HttpStatus } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Server status response' })
export class StatusType {
  @Field(() => Int)
  status: HttpStatus;

  @Field({ nullable: true })
  message?: string;
}
