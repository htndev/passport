import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { HasRefreshTokenGuard } from './../common/guards/token/has-refresh-token.guard';
import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @UseGuards(HasRefreshTokenGuard)
  @Get('/')
  async getTokens(@Req() request: Request, @Res() response: Response): Promise<any> {
    // return response.send(await this.tokensService.getTokens(request, response));
  }
}
