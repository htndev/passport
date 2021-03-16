import { Field, InputType } from '@nestjs/graphql';
import { passwordRegexp } from '@xbeat/toolkit';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

const MinMaxLength = Length(4, 255);

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinMaxLength
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinMaxLength
  @Matches(passwordRegexp())
  newPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinMaxLength
  @Matches(passwordRegexp())
  newPasswordConfirmation: string;
}
