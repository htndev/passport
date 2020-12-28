import { Module } from '@nestjs/common';

import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { RedisConfig } from './redis.config';
import { SecurityConfig } from './security.config';

@Module({
  providers: [DatabaseConfig, AppConfig, SecurityConfig, RedisConfig],
  exports: [DatabaseConfig, AppConfig, SecurityConfig, RedisConfig]
})
export class ConfigModule {}
