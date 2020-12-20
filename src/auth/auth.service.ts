import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseUserJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { SecurityConfig } from '../common/providers/config/security.config';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { DateService } from '../common/providers/date/date.service';
import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { TokenService } from '../common/providers/token/token.service';
import { CookieSetterFunction, MicroserviceToken, TokenType } from '../common/utils/types';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { Microservice, REFRESH_TOKEN, TOKENS, UUID } from './../common/constants';
import { RedisWrapperService } from './../common/providers/redis-wrapper/redis-wrapper.service';
import { UuidService } from './../common/providers/uuid/uuid.service';
import { StatusType } from './../common/types/status.type';
import { NewUserInput } from './inputs/new-user.input';
import { SignInUserInput } from './inputs/sign-in-user.input';

@Injectable()
export class AuthService {
  readonly #logger = new Logger('Auth Service');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
    private readonly locationIdentifier: LocationIdentifierService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly dateService: DateService,
    private readonly securityConfig: SecurityConfig,
    private readonly redisWrapperService: RedisWrapperService,
    private readonly uuidService: UuidService
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

    const uuid = await this.uuidService.registerUuid();
    await this.setTokens(uuid, tokens, { email, username }, cookieSetter);

    this.#logger.verbose(`User ${email} successfully signed up`);

    return { status: HttpStatus.CREATED, message: 'User successfully created' };
  }

  async signIn(user: SignInUserInput, cookieSetter: CookieSetterFunction): Promise<StatusType> {
    const userData = await this.userRepository.signIn(user);
    const tokens = await this.tokenService.generateTokens(userData);

    const uuid = await this.uuidService.registerUuid();

    await this.setTokens(uuid, tokens, userData, cookieSetter);

    this.#logger.verbose(`User ${user.email} successfully signed in`);

    return { status: HttpStatus.OK };
  }

  async logout(uuid: string, cookieSetter: CookieSetterFunction): Promise<StatusType> {
    const actions = TOKENS.map(async (service: TokenType) => {
      this.redisWrapperService.deleteToken(uuid, service);
    });

    await Promise.all(actions);
    await this.uuidService.deleteUuid(uuid);

    this.cookieService.deleteCookie(cookieSetter, UUID);

    return { status: HttpStatus.OK };
  }

  private async setTokens(
    uuid: string,
    tokens: Required<MicroserviceToken>,
    user: BaseUserJwtPayload,
    cookieSetter: CookieSetterFunction
  ): Promise<void> {
    const actions = Object.keys(tokens).map(async (token: Microservice) => {
      return this.redisWrapperService.setToken(uuid, token, tokens[token], this.securityConfig.jwtAccessTokenExpiresIn);
    });

    await Promise.all(actions);

    const refreshToken = await this.tokenService.generateRefreshToken(user);
    const { exp } = await this.tokenService.parseToken(refreshToken, this.securityConfig.jwtRefreshTokenSecret);

    await this.redisWrapperService.setToken(
      uuid,
      REFRESH_TOKEN,
      refreshToken,
      this.securityConfig.jwtRefreshTokenExpiresIn
    );
    this.cookieService.setCookie(cookieSetter, UUID, uuid, this.dateService.timestampToDate(exp));
  }
}
