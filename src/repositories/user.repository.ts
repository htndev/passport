import { PromisePick } from '../common/types';
import { ConflictException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';

import { ErrorMessage } from '../common/constants';
import { NewUserDto, UserDto } from '../auth/dto/user.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({
    email,
    username,
    password,
    countryCode
  }: Omit<NewUserDto, 'ip'> & { countryCode: number }): Promise<User> {
    const user = new User();
    const { password: hashedPassword } = await this.hashPassword(password);

    user.email = email;
    user.username = username;
    user.password = hashedPassword;
    user.countryCode = countryCode;

    return user.save();
  }

  async findUserByEmail(email: string): PromisePick<User, 'email'> {
    const query = this.createQueryBuilder('user')
      .select(['user.email'])
      .where('email = :email', { email });
    return query.getOne();
  }

  async findUserByUsername(username: string): PromisePick<User, 'username'> {
    const query = this.createQueryBuilder('user')
      .select(['user.username'])
      .where('username = :username', { username });
    return query.getOne();
  }

  async findUserByEmailAndUsername({
    email,
    username
  }: {
    email: string;
    username: string;
  }): PromisePick<User, 'email' | 'username'> {
    const query = this.createQueryBuilder('user')
      .select(['user.username', 'user.email'])
      .where('username = :username', { username })
      .andWhere('email = :email', { email });

    return query.getOne();
  }

  private async hashPassword(password: string): Promise<{ password: string }> {
    const salt = await genSalt();

    return {
      password: await hash(password, salt)
    };
  }

  async signIn({ email, password }: UserDto): Promise<{ username: string; email: string }> {
    const user = await this.getUserCredentials({ email });

    if (!user) {
      throw new ConflictException(ErrorMessage.WrongEmailOrPassword);
    }

    const isPasswordMatched = await user.comparePasswords(password);

    if (!isPasswordMatched) {
      throw new ConflictException(ErrorMessage.WrongEmailOrPassword);
    }

    return {
      username: user.username,
      email: user.email
    };
  }

  private async getUserCredentials({
    email
  }): PromisePick<User, 'username' | 'email' | 'password' | 'comparePasswords'> {
    const query = this.createQueryBuilder('user');

    return query
      .select(['user.username', 'user.email', 'user.password'])
      .where('email = :email', { email })
      .getOne();
  }
}
