import { TokenType } from './utils/types';

export enum ErrorMessage {
  WrongEmailOrPassword = 'Wrong email or password',
  UserAuthorized = 'User is already authorized',
  IncorrectData = 'Passed data is incorrect'
}

export enum Microservice {
  PASSPORT = 'passport',
  MEDIA = 'media',
  STUDIO = 'studio'
}

export const UUID = 'uuid';

export const TOKEN_PREFIX = 'token';

export const REFRESH_TOKEN = 'refresh';

export const MICROSERVICES: Microservice[] = [Microservice.PASSPORT, Microservice.STUDIO, Microservice.MEDIA];

export const TOKENS: TokenType[] = [...MICROSERVICES, REFRESH_TOKEN];

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
}
