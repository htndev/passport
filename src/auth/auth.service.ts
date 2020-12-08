import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';

import { SecurityConfig } from '../common/providers/config/security.config';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { DateService } from '../common/providers/date/date.service';
import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { TokenService } from '../common/providers/token/token.service';
import { CookieSetterFunction } from '../common/utils/types';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { MICROSERVICES, REFRESH_TOKEN_COOKIE } from './../common/constants';
import { StatusType } from './../common/types/status.type';
import { NewUserInput } from './inputs/new-user.input';
import { SignInUserInput } from './inputs/sign-in-user.input';
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

  async signUp(
    { ip, email, password, username }: NewUserInput,
    cookieSetter: CookieSetterFunction
  ): Promise<StatusType> {
    const userWithEmail = await this.userRepository.findUserByEmail(email);

    if (userWithEmail) {
      throw new ConflictException(`User with email '${email}' already exists`);
    }

    const userWithUsername = await this.userRepository.findUserByUsername(username);

    if (userWithUsername) {
      throw new ConflictException(`User with username '${username}' already exists`);
    }

    const ipInfo = await this.locationIdentifier.getInfo(ip);
    const location = await this.locationRepository.getOrInsertLocation(ipInfo);

    await this.userRepository.signUp({
      email,
      username,
      location,
      password
    });

    const tokens = await this.tokenService.generateTokens({ email, username });

    await this.cookieService.setBatchOfCookies(cookieSetter, tokens);

    return { status: HttpStatus.CREATED, message: 'User successfully created' };
  }

  async signIn(user: SignInUserInput, cookieSetter: CookieSetterFunction): Promise<StatusType> {
    const userData = await this.userRepository.signIn(user);
    const tokens = await this.tokenService.generateTokens(userData);

    await this.cookieService.setBatchOfCookies(cookieSetter, tokens);

    await this.setRefreshToken(cookieSetter, userData);

    return { status: HttpStatus.OK };
  }

  async logout(cookieSetter: CookieSetterFunction): Promise<StatusType> {
    let tokens = MICROSERVICES.map((microservice: string) => microservice);
    tokens = [...tokens, REFRESH_TOKEN_COOKIE];

    tokens.forEach((token: string) => {
      this.cookieService.deleteCookie(cookieSetter, token);
    });

    return { status: HttpStatus.OK };
  }

  async setRefreshToken(cookieSetter: CookieSetterFunction, user: UserJwtPayload): Promise<void> {
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    const { exp } = await this.tokenService.parseToken(refreshToken, this.securityConfig.jwtRefreshTokenSecret);

    this.cookieService.setCookie(
      cookieSetter,
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      this.dateService.timestampToDate(exp)
    );
  }
}
