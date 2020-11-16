import { CommonModule } from './../common/common.module';
import { TokenService } from './../common/providers/token/token.service';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonModule],
  controllers: [TokensController],
  providers: [TokensService, TokenService]
})
export class TokensModule {}
