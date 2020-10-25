import { AppConfig } from './common/providers/config/app.config';
import { DatabaseConfig } from './common/providers/config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CredentialsModule } from './credentials/credentials.module';
import { LocationIdentifierModule } from './location-identifier/location-identifier.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CredentialsModule,
    ConfigModule.forRoot({ 
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production'
     }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig
    }),
    LocationIdentifierModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfig, AuthService],
})
export class AppModule {}
