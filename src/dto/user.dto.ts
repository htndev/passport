import {
  IsEmail,
  IsIP,
  IsLowercase,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { passwordRegexp, usernameRegexp } from '../common/regexp';

export class NewUserDto {
  @ApiProperty({
    examples: ['example@example.com', 'john@doe.com', 'lincoln@usa.gov.us'],
    description: 'Should be unique email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail({
    allow_ip_domain: false,
  }, {
    message: 'Email is not in email format. E.g, john.doe@example.com'
  })
  email: string;

  @ApiProperty({
    examples: ['htn.dev', 'nickname', 'super_cool', 'mr.wow'],
    description: 'Should be unique username in lowercase',
    required: true,
  })
  @IsNotEmpty()
  @IsLowercase()
  @Matches(usernameRegexp(), {
    message: 'Username does not correspond to pattern'
  })
  username: string;

  @ApiProperty({
    examples: ['Qwerty1337!', 'SuP3RP@$$w0rd'],
    required: true,
    pattern: passwordRegexp().toString(),
  })
  @IsNotEmpty()
  @Matches(passwordRegexp(), { message: 'Password is too weak' })
  password: string;

  @ApiProperty({
    examples: ['193.54.31.63', '54.112.54.87'],
    required: true,
  })
  @IsNotEmpty()
  @IsIP('4')
  ip: string;
}
