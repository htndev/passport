import { BadRequestException, ConflictException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UUID } from '../common/constants/common.constant';
import { Microservice } from '../common/constants/microservice.constant';
import { REFRESH_TOKEN, TOKENS } from '../common/constants/token.constant';
import { CookieSetterFunction, MicroserviceToken, TokenType } from '../common/constants/type.constant';
import { BaseUserJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { SecurityConfig } from '../common/providers/config/security.config';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { DateService } from '../common/providers/date/date.service';
import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { RedisWrapperService } from '../common/providers/redis-wrapper/redis-wrapper.service';
import { TokenService } from '../common/providers/token/token.service';
import { UuidService } from '../common/providers/uuid/uuid.service';
import { StatusType } from '../common/types/status.type';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { ExistsType } from '../common/types/exists.type';
import { NewUserInput } from './inputs/new-user.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { IsAuthorizedType } from './types/is-authorized.type';

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

  isAuthorized(uuid: string): IsAuthorizedType {
    return {
      isAuthorized: typeof uuid === 'string'
    };
  }

  async generatePasswordResetToken(email: string): Promise<StatusType> {
    if (!email) {
      throw new BadRequestException('Email should be provided');
    }
    const user = await this.userRepository.findUserByEmail(email, ['id', 'email', 'username']);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const restorePasswordId = await this.uuidService.registerUuid();

    await this.redisWrapperService.setResetToken(restorePasswordId, user.id);

    // TODO: send letter to mailer

    return {
      status: HttpStatus.CREATED,
      message: 'Reset link sent to your email'
    };
  }

  async isTokenExists(token: string): Promise<ExistsType> {
    if (!token) {
      throw new BadRequestException('Token is not provided');
    }

    const _token = await this.redisWrapperService.getResetToken(token);

    return {
      exists: !!_token
    };
  }

  async resetPassword({ password, passwordConfirmation, token }: ResetPasswordInput): Promise<StatusType> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Password and password confirmation are not equal');
    }

    const { exists } = await this.isTokenExists(token);

    if (!exists) {
      throw new NotFoundException('Token not found. Not registered or expired');
    }

    const userId = await this.redisWrapperService.getResetToken(token);

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.updatePassword(+userId, password);

    await this.redisWrapperService.delResetToken(token);

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Password successfully updated'
    };
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
