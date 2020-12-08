import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SignInUserInput {
  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
