import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';

import { passwordRegexp } from '../../common/constants/regexp.constant';

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
