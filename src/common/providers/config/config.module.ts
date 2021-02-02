import { Module } from '@nestjs/common';

import { AmqpConfig } from './amqp.config';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { MicroservicesConfig } from './microservices.config';
import { RedisConfig } from './redis.config';
import { SecurityConfig } from './security.config';

const CONFIGS = [DatabaseConfig, AppConfig, SecurityConfig, RedisConfig, AmqpConfig, MicroservicesConfig];

@Module({
  providers: CONFIGS,
  exports: CONFIGS
})
export class ConfigModule {}
