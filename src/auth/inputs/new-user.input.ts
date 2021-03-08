import { Field, InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { passwordRegexp, usernameRegexp } from '@xbeat/toolkit';
import { IsIP, IsLowercase, IsNotEmpty, Matches } from 'class-validator';

import { Language } from '../../common/constants/languages.constant';
import { IsEmail } from '../../common/utils/is-email.util';

@InputType({ description: 'Fields for new user' })
export class NewUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail
  email: string;

  @Field()
  @IsNotEmpty()
  @IsLowercase()
  @Matches(usernameRegexp(), { message: 'Username does not correspond to pattern' })
  username: string;

  @Field()
  @IsNotEmpty()
  @Matches(passwordRegexp(), { message: 'Password is too weak' })
  password: string;

  @Field()
  @IsNotEmpty()
  @IsIP('4')
  ip: string;

  @OptionalField({ defaultValue: 'en' })
  lang: Language;
}
