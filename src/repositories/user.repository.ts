import { UserPreferences } from './../entities/user-preferences.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { buildFieldLabels } from '@xbeat/server-toolkit';
import { genSalt, hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';

import { NewUserInput } from '../auth/inputs/new-user.input';
import { SignInUserInput } from '../auth/inputs/sign-in-user.input';
import { ErrorMessage } from '../common/constants/error.constant';
import { AllowedUserFields } from '../common/constants/type.constant';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  readonly #label = 'user';
  readonly #defaultReturnFields: AllowedUserFields[] = ['id', 'email', 'username', 'locationId'];

  async signUp({
    email,
    username,
    password,
    location,
    lang
  }: Omit<NewUserInput, 'ip'> & { location: Location }): Promise<User> {
    const user = new User();
    const { password: hashedPassword } = await this.hashPassword(password);

    const preferences = new UserPreferences();
    preferences.language = lang;
    await preferences.save();

    user.email = email;
    user.username = username;
    user.password = hashedPassword;
    user.location = location;
    user.preferences = preferences;

    return user.save();
  }

  async findUserByEmail<T extends AllowedUserFields>(email: string, fields?: T[]): Promise<Pick<User, T> | undefined> {
    const query = this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, fields ?? ['email']))
      .where('email = :email', { email });
    return query.getOne();
  }

  async findUserByUsername<T extends string[]>(username: string, fields?: T): Promise<User | undefined> {
    const query = this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, fields ?? ['username']))
      .where('username = :username', { username });
    return query.getOne();
  }

  async findUserByEmailAndUsername({
    email,
    username
  }: {
    email: string;
    username: string;
  }): Promise<Pick<User, 'email' | 'username' | 'id'> | undefined> {
    const query = this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, ['id', 'username', 'email', 'avatar']))
      .where('username = :username', { username })
      .andWhere('email = :email', { email });

    return query.getOne();
  }

  async findById(id: number): Promise<User | undefined> {
    return this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, ['id', 'username', 'email', 'avatar', 'isEmailConfirmed']))
      .where('id = :id', { id })
      .getOne();
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

  async getUser(
    fields: Record<string, any>
  ): Promise<Pick<User, 'email' | 'username' | 'id' | 'locationId'> | undefined> {
    return this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, this.#defaultReturnFields))
      .where('username = :username', { username: fields.username })
      .getOne();
  }

  async getUsersLike(
    filters: Record<string, any>,
    fields: AllowedUserFields[] = this.#defaultReturnFields
  ): Promise<User[]> {
    const _fields = buildFieldLabels(this.#label, fields);
    const query = this.createQueryBuilder(this.#label);
    return query
      .select(_fields)
      .where('user.username ilike :username', { username: `%${filters.username}%` })
      .getMany();
  }

  async getUsersByLocation(id: number): Promise<User[]> {
    return this.createQueryBuilder(this.#label)
      .select(buildFieldLabels(this.#label, ['id', 'username', 'email', 'locationId', 'avatar']))
      .where('user.locationId = :id', { id })
      .getMany();
  }

  private async getUserCredentials({
    email
  }): Promise<Pick<User, 'email' | 'username' | 'password' | 'comparePasswords'> | undefined> {
    const query = this.createQueryBuilder(this.#label);

    return query
      .select(buildFieldLabels(this.#label, ['username', 'email', 'password']))
      .where('email = :email', { email })
      .getOne();
  }
}
