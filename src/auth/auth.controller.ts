import { Body, Controller, HttpStatus, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { NotAuthorizedUser } from 'src/common/guards/auth/not-authorized-user.guard';

import { ErrorMessage } from '../common/constants';
import { HasRefreshTokenGuard } from '../common/guards/token/has-refresh-token.guard';
import { errorBuilder } from './../common/dev/swagger';
import { AuthService } from './auth.service';
import { NewUserDto, UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NotAuthorizedUser)
  @Post('/signup')
  @ApiBody({})
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessage.IncorrectData
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: errorBuilder('OR', 'User with email or username already exists', 'You are authorized user')
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully'
  })
  async registration(@Body(ValidationPipe) user: NewUserDto, @Res() response: Response): Promise<any> {
    return response.status(HttpStatus.CREATED).send(await this.authService.register(user, response));
  }

  @UseGuards(NotAuthorizedUser)
  @Post('/signin')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: errorBuilder('OR', ErrorMessage.WrongEmailOrPassword, ErrorMessage.UserAuthorized)
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User authorized'
  })
  async signIn(@Body(ValidationPipe) user: UserDto, @Res() response: Response): Promise<any> {
    return response.send(await this.authService.signIn(user, response));
  }

  @UseGuards(HasRefreshTokenGuard)
  @Post('/logout')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User log outed'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized'
  })
  async logout(@Res() response: Response): Promise<any> {
    return response.send(await this.authService.logout(response));
  }
}
