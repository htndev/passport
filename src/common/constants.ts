export enum ErrorMessage {
  WRONG_EMAIL_OR_PASSWORD = 'Wrong email or password'
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
