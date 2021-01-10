import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { RedisConfig } from '../config/redis.config';
import { RedisWrapperService } from './redis-wrapper.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisConfig, RedisWrapperService],
  exports: [RedisWrapperService]
})
export class RedisWrapperModule {}
