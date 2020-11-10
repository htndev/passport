import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ErrorMessage } from './../common/constants';
import { JwtGuard } from './../common/guards/auth/jwt.guard';
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
  async registration(@Body(ValidationPipe) user: NewUserDto): Promise<any> {
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
  async signIn(@Body(ValidationPipe) user: UserDto, @Res() res: Response): Promise<any> {
    return res.status(200).json(await this.authService.signIn(user, res));
  }

  @UseGuards(JwtGuard)
  @Get('/tokens')
  async getTokens(): Promise<any> {
    // return this.authService.getTokens();
  }

  @Post('/test')
  @UseGuards(JwtGuard)
  test(@Req() req: Request): void {
    console.log(req);
  }
}
