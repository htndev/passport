import { Microservice } from './constants';

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

export type Nullable<T> = T | null;
