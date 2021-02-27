import { Module } from '@nestjs/common';
import { AppConfig, DatabaseConfig, MicroservicesConfig, RedisConfig } from '@xbeat/server-toolkit';

import { AmqpConfig } from './amqp.config';
import { SecurityConfig } from './security.config';

const CONFIGS = [DatabaseConfig, AppConfig, SecurityConfig, RedisConfig, AmqpConfig, MicroservicesConfig];

@Module({
  providers: CONFIGS,
  exports: CONFIGS
})
export class ConfigModule {}
