import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExistsType, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';
import { ApiEndpoint } from '@xbeat/toolkit';

import { TokenService } from '../common/providers/token/token.service';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { SecurityConfig } from './../common/providers/config/security.config';
import { RedisWrapperService } from './../common/providers/redis-wrapper/redis-wrapper.service';
import { ExistsUserInput } from './inputs/exists-user.input';
import { UpdateUserInfoInput } from './inputs/update-user-info.input';
import { UserSearchInput } from './inputs/user-search.input';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    private readonly redisWrapperService: RedisWrapperService,
    private readonly tokenService: TokenService,
    private readonly securityConfig: SecurityConfig
  ) {}

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findUserByUsername(username, [
      'id',
      'username',
      'email',
      'locationId',
      'avatar'
    ]);

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    return user;
  }

  async getUsersByLocation(id: number): Promise<User[]> {
    return this.userRepository.getUsersByLocation(id);
  }

  async getUsers(searchCriteria: UserSearchInput): Promise<UserType[]> {
    return this.userRepository.getUsersLike({ username: searchCriteria.username }) as any;
  }

  async updateUserAvatar(avatarUrl: string, user: UserJwtPayload): Promise<StatusType> {
    const me = await this.userRepository.findById(+user.id);

    if (!me) {
      throw new NotFoundException('User not found');
    }

    me.avatar = avatarUrl;

    await me.save();

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Avatar updated successfully'
    };
  }

  async userExists({ email, username }: ExistsUserInput): Promise<ExistsType> {
    let user: any;

    if (email && username) {
      user = await this.userRepository.findUserByEmailAndUsername({ email, username });
    } else if (email) {
      user = await this.userRepository.findUserByEmail(email);
    } else if (username) {
      user = await this.userRepository.findUserByUsername(username);
    } else {
      throw new BadRequestException('Username or email should be provided or not be empty');
    }

    return {
      exists: user !== undefined
    };
  }

  async updateUserInfo(
    { id, email: currentEmail, username: currentUsername }: UserJwtPayload,
    uuid: string,
    { username, email }: UpdateUserInfoInput
  ): Promise<StatusType> {
    if (!username && !email) {
      throw new BadRequestException('Email or username should be provided');
    }

    if (username && username !== currentUsername) {
      const isUserExists = await this.userRepository.findUserByUsername(username);

      if (isUserExists) {
        throw new ConflictException(`User with username ${username} is already exists`);
      }
    }

    if (email && email === currentEmail) {
      const isUserExists = await this.userRepository.findUserByEmail(email);

      if (isUserExists) {
        throw new ConflictException(`User with email ${email} is already exists`);
      }
    }

    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    const tokens = await this.tokenService.generateTokens(user);

    await Promise.all(
      Object.keys(tokens).map(async (tokenType: ApiEndpoint) =>
        this.redisWrapperService.setToken(
          uuid,
          tokenType,
          tokens[tokenType],
          this.securityConfig.jwtAccessTokenExpiresIn
        )
      )
    );

    return {
      status: HttpStatus.OK
    };
  }
}
