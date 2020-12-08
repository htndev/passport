import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PromisePick } from '../common/utils/types';
import { AuthService } from './../auth/auth.service';
import { User } from './../entities/user.entity';
import { UserRepository } from './../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) {}

  async getUser(username: string): PromisePick<User, 'username'> {
    const user = await this.userRepository.findOne(
      { username },
      {
        join: {
          alias: 'user',
          leftJoin: {
            locations: 'user.locationId'
          }
        }
      }
    );

    return this.userRepository.getUser({ username });
  }

  async getUsers(username: string): Promise<User> {
    return this.userRepository.getUsersLike({ username });
  }
}
