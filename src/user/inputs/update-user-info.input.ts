import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { usernameRegexp } from '@xbeat/toolkit';
import { IsEmail, IsLowercase, IsNotEmpty, IsOptional, Matches } from 'class-validator';

@InputType()
export class UpdateUserInfoInput {
  @OptionalField()
  @IsOptional()
  @IsNotEmpty()
  @IsLowercase()
  @Matches(usernameRegexp(), { message: 'Username does not fit pattern' })
  username: string;

  @OptionalField()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({ allow_ip_domain: false })
  email: string;
}
