import { ApiEndpoint } from '@xbeat/toolkit';
import { CookieOptions } from 'express';

import { User as UserEntity } from '../../entities/user.entity';
import { REFRESH_TOKEN } from './token.constant';

export type Cookies = Record<ApiEndpoint, string>;

export type TokenType = ApiEndpoint | typeof REFRESH_TOKEN;

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

export type MicroserviceToken = { [k in ApiEndpoint]?: string };

export type MicroserviceTokens = { tokens: Required<MicroserviceToken> };

export type Tokens = MicroserviceToken & { [REFRESH_TOKEN]?: string };

export type AllowedUserFields = keyof Pick<
  UserEntity,
  'email' | 'username' | 'id' | 'locationId' | 'password' | 'isEmailConfirmed'
>;

export type CookieSetterFunction = (name: string, value: string | number, options: CookieOptions) => void;
