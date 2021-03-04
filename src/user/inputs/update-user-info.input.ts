import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { usernameRegexp } from '@xbeat/toolkit';
import { IsLowercase, IsNotEmpty, IsOptional, Matches } from 'class-validator';

import { IsEmail } from '../../common/utils/is-email.util';

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
  @IsEmail
  email: string;
}
