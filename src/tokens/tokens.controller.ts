import { HasRefreshTokenGuard } from './../common/guards/token/has-refresh-token.guard';
import { Request } from 'express';
import { TokensService } from './tokens.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokensService: TokensService
  ) {}

  @UseGuards(HasRefreshTokenGuard)
  @Get('/')
  async getTokens(@Req() request: Request): Promise<any> {
    return this.tokensService.getTokens(request);
  }
}
