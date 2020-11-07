import { LocationRepository } from './../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocationIdentifierModule } from '../location-identifier/location-identifier.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, LocationRepository]), LocationIdentifierModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
