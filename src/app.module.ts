import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfig } from './common/providers/config/app.config';
import { DatabaseConfig } from './common/providers/config/database.config';
import { LocationIdentifierModule } from './location-identifier/location-identifier.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production'
     }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig
    }),
    LocationIdentifierModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, AppConfig],
})
export class AppModule {}
