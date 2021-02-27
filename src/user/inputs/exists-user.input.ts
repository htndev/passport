import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { IsEmail, IsLowercase, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsEmail({ allow_ip_domain: false }, { message: 'Email is not in email format. E.g, john.doe@example.com' })
  email?: string;
}
