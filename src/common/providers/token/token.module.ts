import { Module } from '@nestjs/common';

import { CommonModule } from '../../common.module';
import { RedisWrapperModule } from '../redis-wrapper/redis-wrapper.module';
import { TokenService } from './token.service';

@Module({
  imports: [CommonModule, RedisWrapperModule],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
