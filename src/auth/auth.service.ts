import { MICROSERVICES, REFRESH_COOKIE } from './../common/constants';
import { SecurityConfig } from '../common/providers/config/security.config';
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';

import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { TokenService } from '../common/providers/token/token.service';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { DateService } from '../common/providers/date/date.service';
import { NewUserDto, UserDto } from './dto/user.dto';
import { UserJwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
    private readonly locationIdentifier: LocationIdentifierService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly dateService: DateService,
    private readonly securityConfig: SecurityConfig
  ) {}

  async register({ ip, email, password, username }: NewUserDto, response: Response): Promise<{ status: HttpStatus }> {
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

    await this.cookieService.setBatchOfCookies(response, tokens, this.securityConfig.tokenPrefix);

    return { status: HttpStatus.CREATED };
  }

  async signIn(user: UserDto, response: Response): Promise<{ status: HttpStatus }> {
    const userData = await this.userRepository.signIn(user);
    const tokens = await this.tokenService.generateTokens(userData);

    await this.cookieService.setBatchOfCookies(response, tokens, this.securityConfig.tokenPrefix);

    await this.setRefreshToken(response, userData);

    return { status: HttpStatus.OK };
  }

  async logout(response: Response): Promise<{ status: HttpStatus }> {
    let tokens = MICROSERVICES.map((microservice: string) => `${this.securityConfig.tokenPrefix}${microservice}`);
    tokens = [...tokens, `${this.securityConfig.tokenPrefix}${REFRESH_COOKIE}`];

    tokens.forEach((token: string) => {
      this.cookieService.deleteCookie(response, token);
    });

    return { status: HttpStatus.OK };
  }

  async setRefreshToken(response: Response, user: UserJwtPayload): Promise<void> {
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    const { exp } = await this.tokenService.parseToken(refreshToken, this.securityConfig.jwtRefreshTokenSecret);

    this.cookieService.setCookie(
      response,
      `${this.securityConfig.tokenPrefix}${REFRESH_COOKIE}`,
      refreshToken,
      this.dateService.timestampToDate(exp)
    );
  }
}
