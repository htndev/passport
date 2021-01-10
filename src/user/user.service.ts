import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StatusType } from '../common/types/status.type';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserSearchInput } from './inputs/user-search.input';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

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

  async updateUserAvatar(avatarUrl: string, user: UserType): Promise<StatusType> {
    const me = await this.userRepository.findById(user.id);

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
}
