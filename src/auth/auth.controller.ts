import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { NewUserDto } from './../dto/user.dto';

@Controller('auth')
export class AuthController {
  @Post('/')
  @ApiResponse({
    status: 403,
    description: 'Passed data is incorrect',
  })
  @ApiResponse({
    status: 409,
    description: 'User with email or username already exists',
  })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
  })
  async registration(@Body(ValidationPipe) user: NewUserDto): Promise<any> {
    console.log(user);
  }
}
