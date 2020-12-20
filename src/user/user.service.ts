import { UserType } from './user.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PromisePick } from '../common/utils/types';
import { User } from './../entities/user.entity';
import { UserRepository } from './../repositories/user.repository';
import { UserSearchInput } from './inputs/user-search.input';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

  async getUser(username: string): PromisePick<User, 'username'> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    return this.getUserFields(user);
  }

  async getUsers(searchCriteria: UserSearchInput): Promise<UserType[]> {
    return this.userRepository.getUsersLike({ username: searchCriteria.username }) as any;
  }

  private getUserFields(user: User): Omit<User, 'password'> {
    // * To exclude password from user data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest as Omit<User, 'password'>;
  }
}
