import { Module } from '@nestjs/common';

import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { SecurityConfig } from './security.config';

@Module({
  providers: [DatabaseConfig, AppConfig, SecurityConfig],
  exports: [DatabaseConfig, AppConfig, SecurityConfig]
})
export class ConfigModule {}
