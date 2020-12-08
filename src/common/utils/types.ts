import { CookieOptions } from 'express';

import { UserJwtPayload } from '../../auth/interface/jwt-payload.interface';
import { User as UserEntity } from '../../entities/user.entity';
import { Microservice } from '../constants';

export interface LocationInfo {
  readonly country: string;
  readonly code: string;
  readonly region: string;
  readonly city: string;
}

export interface User extends UserJwtPayload {
  id: string;
}

export const DatabaseErrorMessages = {
  [23505]: 'Duplicate'
};

export type PromisePick<T, K extends keyof T> = Promise<Pick<T, K>>;

export type MicroserviceToken = { [k in Microservice]?: string };

export type MicroserviceTokens = { tokens: Required<MicroserviceToken> };

export type Nullable<T> = T | null;

export type AllowedUserFields = keyof Pick<UserEntity, 'email' | 'username' | 'id' | 'locationId' | 'password'>;

export type CookieSetterFunction = (name: string, value: string | number, options: CookieOptions) => void;

