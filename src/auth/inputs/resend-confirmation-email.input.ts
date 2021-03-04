import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { IsEmail } from '../../common/utils/is-email.util';

@InputType()
export class ResendConfirmationEmailInput {
  @Field()
  @IsNotEmpty()
  @IsEmail
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lang: string;
}
