import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { IsLowercase, IsNotEmpty, IsOptional } from 'class-validator';

import { IsEmail } from '../../common/utils/is-email.util';

@InputType()
export class ExistsUserInput {
  @OptionalField()
  @IsOptional()
  @IsNotEmpty()
  @IsLowercase()
  username?: string;

  @OptionalField()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail
  email?: string;
}
