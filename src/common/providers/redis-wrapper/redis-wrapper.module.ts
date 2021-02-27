import { Module } from '@nestjs/common';
import { RedisConfig } from '@xbeat/server-toolkit';

import { ConfigModule } from '../config/config.module';
import { RedisWrapperService } from './redis-wrapper.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisConfig, RedisWrapperService],
  exports: [RedisWrapperService]
})
export class RedisWrapperModule {}
