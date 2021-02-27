import { Field, InputType } from '@nestjs/graphql';
import { passwordRegexp } from '@xbeat/toolkit';
import { IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  token: string;

  @Field()
  @IsNotEmpty()
  @Matches(passwordRegexp(), { message: 'Password is too weak' })
  password: string;

  @Field()
  @IsNotEmpty()
  passwordConfirmation: string;
}
