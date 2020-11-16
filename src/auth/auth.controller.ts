import { Body, Controller, HttpStatus, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ErrorMessage } from '../common/constants';
import { HasRefreshTokenGuard } from '../common/guards/token/has-refresh-token.guard';
import { AuthService } from './auth.service';
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
  async registration(
    @Body(ValidationPipe) user: NewUserDto,
    @Res() response: Response
  ): Promise<any> {
    return response.send(await this.authService.register(user, response));
  }

  @Post('/signin')
  @ApiResponse({
    status: 409,
    description: ErrorMessage.WrongEmailOrPassword
  })
  @ApiResponse({
    status: 200,
    description: 'User authorized'
  })
  async signIn(@Body(ValidationPipe) user: UserDto, @Res() response: Response): Promise<any> {
    return response.send(await this.authService.signIn(user, response));
  }

  @Post('/logout')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User log outed'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized'
  })
  @UseGuards(HasRefreshTokenGuard)
  async logout(@Res() response: Response): Promise<any> {
    return response.send(await this.authService.logout(response));
  }
}
