import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './../entities/user.entity';
import { UserRepository } from './../repositories/user.repository';
import { UserSearchInput } from './inputs/user-search.input';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findUserByUsername(username, ['id', 'username', 'email', 'locationId']);

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
}
