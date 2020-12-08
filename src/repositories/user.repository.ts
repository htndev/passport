import { ConflictException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';

import { NewUserInput } from '../auth/inputs/new-user.input';
import { ErrorMessage } from '../common/constants';
import { AllowedUserFields, PromisePick } from '../common/utils/types';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { SignInUserInput } from './../auth/inputs/sign-in-user.input';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  readonly #label = 'user';
  readonly #defaultReturnFields: AllowedUserFields[] = ['id', 'email', 'username', 'locationId'];

  async signUp({
    email,
    username,
    password,
    location
  }: Omit<NewUserInput, 'ip'> & { location: Location }): Promise<User> {
    const user = new User();
    const { password: hashedPassword } = await this.hashPassword(password);

    user.email = email;
    user.username = username;
    user.password = hashedPassword;
    user.location = location;

    return user.save();
  }

  async findUserByEmail(email: string): PromisePick<User, 'email'> {
    const query = this.createQueryBuilder(this.#label)
      .select(['user.email'])
      .where('email = :email', { email });
    return query.getOne();
  }

  async findUserByUsername(username: string): PromisePick<User, 'username'> {
    const query = this.createQueryBuilder(this.#label)
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
  }): PromisePick<User, 'email' | 'username' | 'id'> {
    const query = this.createQueryBuilder(this.#label)
      .select(this.buildFieldLabels(this.#label, ['id', 'username', 'email']))
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

  async signIn({ email, password }: SignInUserInput): Promise<{ username: string; email: string }> {
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

  async getUser(fields: Record<string, any>): PromisePick<User, 'username' | 'id' | 'email' | 'locationId'> {
    return this.createQueryBuilder(this.#label)
      .select(this.buildFieldLabels(this.#label, this.#defaultReturnFields))
      .where('username = :username', { username: fields.username })
      .getOne();
  }

  async getUsersLike(
    filters: Record<string, any>,
    fields: AllowedUserFields[] = this.#defaultReturnFields
  ): Promise<any> {
    const _fields = this.buildFieldLabels(this.#label, fields);
    const query = this.createQueryBuilder(this.#label);
    return query
      .select(_fields)
      .where('user.username ilike :username', { username: `%${filters.username}%` })
      .getMany();
  }

  private buildFieldLabels(label: string, fields: AllowedUserFields[]): AllowedUserFields[] {
    return fields.reduce((acc, field) => [...acc, `${label}.${field}`], []);
  }

  private async getUserCredentials({
    email
  }): PromisePick<User, 'username' | 'email' | 'password' | 'comparePasswords'> {
    const query = this.createQueryBuilder(this.#label);

    return query
      .select(this.buildFieldLabels(this.#label, ['username', 'email', 'password']))
      .where('email = :email', { email })
      .getOne();
  }
}
