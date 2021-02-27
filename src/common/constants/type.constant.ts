import { CookieOptions } from 'express';

import { User as UserEntity } from '../../entities/user.entity';
import { Microservice } from './microservice.constant';
import { REFRESH_TOKEN } from './token.constant';

export type Cookies = Record<Microservice, string>;

export type TokenType = Microservice | typeof REFRESH_TOKEN;

export interface LocationInfo {
  readonly country: string;
  readonly code: string;
  readonly region: string;
  readonly city: string;
}

export const DatabaseErrorMessages = {
  [23505]: 'Duplicate'
};

export type PromisePick<T, K extends keyof T> = Promise<Pick<T, K>>;

export type MicroserviceToken = { [k in Microservice]?: string };

export type MicroserviceTokens = { tokens: Required<MicroserviceToken> };

export type Tokens = MicroserviceToken & { [REFRESH_TOKEN]?: string };

export type AllowedUserFields = keyof Pick<
  UserEntity,
  'email' | 'username' | 'id' | 'locationId' | 'password' | 'isEmailConfirmed'
>;

export type CookieSetterFunction = (name: string, value: string | number, options: CookieOptions) => void;
