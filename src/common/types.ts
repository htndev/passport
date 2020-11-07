export interface LocationInfo {
  readonly country: string;
  readonly code: string;
  readonly region: string;
  readonly city: string;
}

export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development'
}

export const DatabaseErrorMessages = {
  [23505]: 'Duplicate'
}