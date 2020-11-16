export enum ErrorMessage {
  WrongEmailOrPassword = 'Wrong email or password'
};

export enum Microservice {
  PASSPORT = 'passport',
  MEDIA = 'media',
  STUDIO = 'studio'
};

export const MICROSERVICES: Microservice[] = [Microservice.PASSPORT, Microservice.STUDIO, Microservice.MEDIA];

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
};

export const REFRESH_COOKIE = 'refresh';