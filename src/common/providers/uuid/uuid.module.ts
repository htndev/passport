import { Module } from '@nestjs/common';
import { RedisConfig } from '@xbeat/server-toolkit';

import { SecurityConfig } from '../config/security.config';
import { RedisWrapperModule } from '../redis-wrapper/redis-wrapper.module';
import { UuidService } from './uuid.service';

@Module({
  imports: [RedisWrapperModule],
  providers: [UuidService, SecurityConfig, RedisConfig],
  exports: [UuidService]
})
export class UuidModule {}
