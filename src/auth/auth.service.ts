import { RequestResetPasswordInput } from './inputs/request-reset-password.input';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CONFIRMATION, RESET, UUID } from '../common/constants/common.constant';
import { Microservice } from '../common/constants/microservice.constant';
import { REFRESH_TOKEN, TOKENS } from '../common/constants/token.constant';
import { CookieSetterFunction, MicroserviceToken, TokenType } from '../common/constants/type.constant';
import { BaseUserJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AmqpConfig } from '../common/providers/config/amqp.config';
import { MicroservicesConfig } from '../common/providers/config/microservices.config';
import { SecurityConfig } from '../common/providers/config/security.config';
import { CookieService } from '../common/providers/cookie/cookie.service';
import { DateService } from '../common/providers/date/date.service';
import { LocationIdentifierService } from '../common/providers/location-identifier/location-identifier.service';
import { RedisWrapperService } from '../common/providers/redis-wrapper/redis-wrapper.service';
import { TokenService } from '../common/providers/token/token.service';
import { UuidService } from '../common/providers/uuid/uuid.service';
import { ExistsType } from '../common/types/exists.type';
import { StatusType } from '../common/types/status.type';
import { LocationRepository } from '../repositories/location.repository';
import { UserRepository } from '../repositories/user.repository';
import { EmailRepository } from './../repositories/email.repository';
import { NewUserInput } from './inputs/new-user.input';
import { ResendConfirmationEmailInput } from './inputs/resend-confirmation-email.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { SignInUserInput } from './inputs/sign-in-user.input';
import { EmailConfirmedType } from './types/email-confirmed.type';
import { IsAuthorizedType } from './types/is-authorized.type';

@Injectable()
export class AuthService {
  readonly #logger = new Logger('Auth Service');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LocationRepository)
    private readonly locationRepository: LocationRepository,
    @InjectRepository(EmailRepository)
    private readonly emailRepository: EmailRepository,
    private readonly locationIdentifier: LocationIdentifierService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly dateService: DateService,
    private readonly securityConfig: SecurityConfig,
    private readonly microservicesConfig: MicroservicesConfig,
    private readonly redisWrapperService: RedisWrapperService,
    private readonly uuidService: UuidService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async signUp({ ip, email, password, username, lang }: NewUserInput): Promise<StatusType> {
    const userWithEmail = await this.userRepository.findUserByEmail(email, ['email', 'isEmailConfirmed']);
    if (userWithEmail?.isEmailConfirmed) {
      throw new ConflictException(`Your account is not confirmed.`);
    }
    if (userWithEmail) {
      throw new ConflictException(`User with email '${email}' already exists`);
    }

    const userWithUsername = await this.userRepository.findUserByUsername(username);

    if (userWithUsername) {
      throw new ConflictException(`User with username '${username}' already exists`);
    }

    const ipInfo = await this.locationIdentifier.getInfo(ip);
    const location = await this.locationRepository.getOrInsertLocation(ipInfo);

    const user = await this.userRepository.signUp({
      email,
      username,
      location,
      password
    });

    await this.sendConfirmationEmail({ email, lang, id: user.id });

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

  async isUserEmailConfirmed(email: string): Promise<EmailConfirmedType> {
    if (!email) {
      throw new BadRequestException('Email should be provided');
    }

    const user = await this.userRepository.findUserByEmail(email, ['isEmailConfirmed']);

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    return {
      confirmed: user.isEmailConfirmed
    };
  }

  async generatePasswordResetToken({ email, lang }: RequestResetPasswordInput): Promise<StatusType> {
    if (!email) {
      throw new BadRequestException('Email should be provided');
    }

    const user = await this.userRepository.findUserByEmail(email, ['id', 'email', 'username']);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const restorePasswordId = await this.uuidService.registerUuid();

    await this.redisWrapperService.setSpecialToken(RESET, restorePasswordId, user.id);

    const url = `${this.microservicesConfig.id}/${lang}/recover/${restorePasswordId}`;

    await this.amqpConnection.publish(AmqpConfig.exchange, `${AmqpConfig.queue.mailer}.forgotPassword`, {
      email,
      url,
      lang,
      uuid: restorePasswordId
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Reset link sent to your email'
    };
  }

  async isPasswordResetTokenExists(token: string): Promise<ExistsType> {
    if (!token) {
      throw new BadRequestException('Token is not provided');
    }

    const _token = await this.redisWrapperService.getSpecialToken(RESET, token);

    if (!_token) {
      return {
        exists: false
      };
    }

    const email = await this.emailRepository.findOne({ uuid: token });

    if (!email) {
      return {
        exists: false
      };
    }

    return {
      exists: email.isActive
    };
  }

  async resetPassword({ password, passwordConfirmation, token }: ResetPasswordInput): Promise<StatusType> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Password and password confirmation are not equal');
    }

    const { exists } = await this.isPasswordResetTokenExists(token);

    if (!exists) {
      throw new NotFoundException('Token not found. Not registered or expired');
    }

    const userId = await this.redisWrapperService.getSpecialToken(RESET, token);

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.updatePassword(+userId, password);

    await this.redisWrapperService.delSpecialToken(RESET, token);

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Password successfully updated'
    };
  }

  async confirmEmail(token: string): Promise<StatusType> {
    if (!token) {
      throw new BadRequestException('Confirmation token not provided');
    }

    const id = await this.redisWrapperService.getSpecialToken(CONFIRMATION, token);

    if (!id) {
      throw new NotFoundException('Token does not exists');
    }

    const user = await this.userRepository.findById(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new ConflictException('User already confirmed his account');
    }

    const confirmationEmail = await this.emailRepository.findEmailByUuid(token);

    if (!confirmationEmail) {
      throw new NotFoundException(`Email with token ${token} not found`);
    }

    if (!confirmationEmail.isActive) {
      throw new NotFoundException('Token does not exists');
    }

    user.isEmailConfirmed = true;
    await user.save();

    await this.redisWrapperService.delSpecialToken(CONFIRMATION, token);

    return {
      status: HttpStatus.ACCEPTED
    };
  }

  async resendConfirmationEmail({ email, lang }: ResendConfirmationEmailInput): Promise<StatusType> {
    const user = await this.userRepository.findUserByEmail(email, ['id', 'isEmailConfirmed']);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (user.isEmailConfirmed) {
      throw new ConflictException('User already confirmed his email');
    }

    await this.sendConfirmationEmail({ email, lang, id: user.id });

    return {
      status: HttpStatus.CREATED,
      message: 'Confirmation email resent successfully'
    };
  }

  async logout(uuid: string, cookieSetter: CookieSetterFunction): Promise<StatusType> {
    await Promise.all(
      TOKENS.map(async (service: TokenType) => {
        this.redisWrapperService.deleteToken(uuid, service);
      })
    );
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

  private async sendConfirmationEmail({ email, lang, id }: { email: string; lang: string; id: number }): Promise<void> {
    const uuid = await this.uuidService.registerUuid();

    await this.redisWrapperService.setSpecialToken(CONFIRMATION, uuid, id);

    const url = `${this.microservicesConfig.id}/${lang}/confirm/${uuid}`;

    await this.amqpConnection.publish(AmqpConfig.exchange, `${AmqpConfig.queue.mailer}.confirmAccount`, {
      email,
      lang,
      url,
      uuid
    });
  }
}
