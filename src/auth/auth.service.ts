import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async register(): Promise<any> {
    const user = new User();
  }
}
