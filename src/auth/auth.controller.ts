import { ErrorMessage } from './../common/constants';
import { AuthService } from './auth.service';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { NewUserDto, UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({
    status: 403,
    description: 'Passed data is incorrect'
  })
  @ApiResponse({
    status: 409,
    description: 'User with email or username already exists'
  })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully'
  })
  async registration(@Body(ValidationPipe) user: NewUserDto): Promise<any> {
    console.log(user);
    return this.authService.register(user);
  }

  @Post('/signin')
  @ApiResponse({
    status: 409,
    description: ErrorMessage.WRONG_EMAIL_OR_PASSWORD
  })
  @ApiResponse({
    status: 200,
    description: 'User authorized'
  })
  async signIn(@Body(ValidationPipe) user: UserDto): Promise<any> {
    return this.authService.signIn(user);
  }
}
