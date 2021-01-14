import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsLowercase, IsNotEmpty, IsOptional } from 'class-validator';

const OPTIONS = { nullable: true };

@InputType()
export class ExistsUserInput {
  @Field(OPTIONS)
  @IsOptional()
  @IsNotEmpty()
  @IsLowercase()
  username?: string;

  @Field(OPTIONS)
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({ allow_ip_domain: false }, { message: 'Email is not in email format. E.g, john.doe@example.com' })
  email?: string;
}
