import { SecurityConfig } from './security.config';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { Module } from "@nestjs/common";

@Module({
  providers: [DatabaseConfig, AppConfig, SecurityConfig],
  exports: [DatabaseConfig, AppConfig, SecurityConfig]
})
export class ConfigModule {}