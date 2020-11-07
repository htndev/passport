import { ConflictException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';

import { ErrorMessage } from '../common/constants';
import { NewUserDto, UserDto } from '../auth/dto/user.dto';
import { User } from '../entities/user.entity';

interface UserCredentials {
  email: string;
  password: string;
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({
    email,
    username,
    password,
    countryCode
  }: Omit<NewUserDto, 'ip'> & { countryCode: number }): Promise<any> {
    const user = new User();
    const { password: hashedPassword } = await this.hashPassword(password);

    user.email = email;
    user.username = username;
    user.password = hashedPassword;
    user.countryCode = countryCode;

    return user.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    const query = this.createQueryBuilder('user')
      .select(['user.email'])
      .where('email = :email', { email });
    return query.getOne();
  }

  async findUserByUsername(username: string): Promise<User> {
    const query = this.createQueryBuilder('user')
      .select(['user.username'])
      .where('username = :username', { username });
    return query.getOne();
  }

  private async hashPassword(password: string): Promise<{ password: string }> {
    const salt = await genSalt();

    return {
      password: await hash(password, salt)
    };
  }

  async signIn({ email, password }: UserDto): Promise<any> {
    const user = await this.getUserCredentials({ email });

    if (!user) {
      throw new ConflictException(ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    const isPasswordMatched = await user.comparePasswords(password);

    if (!isPasswordMatched) {
      throw new ConflictException(ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    return {
      authorized: true
    }
  }

  private async getUserCredentials({ email }): Promise<User> {
    const query = this.createQueryBuilder('user');

    return query
      .select(['user.email', 'user.password'])
      .where('email = :email', { email })
      .getOne();
  }
}
