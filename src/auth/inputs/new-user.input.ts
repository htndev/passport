import { Field, InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { passwordRegexp, usernameRegexp } from '@xbeat/toolkit';
import { IsEmail, IsIP, IsLowercase, IsNotEmpty, Matches } from 'class-validator';

@InputType({ description: 'Fields for new user' })
export class NewUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail({ allow_ip_domain: false }, { message: 'Email is not in email format. E.g, john.doe@example.com' })
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
  lang: string;
}
