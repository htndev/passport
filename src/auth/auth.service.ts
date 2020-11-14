import { Request, Response } from 'express';
import { CookieService } from './../common/providers/cookie/cookie.service';
import { MicroserviceToken } from '../common/types';
import { TokenService } from '../common/providers/token/token.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { NewUserDto, UserDto } from './dto/user.dto';

export type MicroserviceTokens = { tokens: Required<MicroserviceToken> };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
    private readonly locationIdentifier: LocationIdentifierService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService
  ) {}

  async register({ ip, email, password, username }: NewUserDto): Promise<MicroserviceTokens> {
    const userWithEmail = await this.userRepository.findUserByEmail(email);

    if (userWithEmail) {
      throw new ConflictException(`User with email '${email}' already exists`);
    }

    const userWithUsername = await this.userRepository.findUserByUsername(username);

    if (userWithUsername) {
      throw new ConflictException(`User with username '${username}' already exists`);
    }

    const ipInfo = await this.locationIdentifier.getInfo(ip);

    const locationId = await this.locationRepository.getOrInsertLocation(ipInfo);

    await this.userRepository.signUp({
      email,
      username,
      countryCode: locationId,
      password
    });

    const tokens = await this.tokenService.generateTokens({ email, username });

    return { tokens };
  }

  async signIn(user: UserDto, res: Response): Promise<MicroserviceTokens> {
    const userData = await this.userRepository.signIn(user);
    const tokens = await this.tokenService.generateTokens(userData);

    await this.cookieService.setBatchOfCookies(res, tokens, 'token.');

    return { tokens };
  }
}
