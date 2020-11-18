export interface UserJwtPayload {
  username: string;
  email: string;
}

export interface JwtPayload extends UserJwtPayload {
  scope?: string;
  iss?: string;
  iat?: number;
  exp?: number;
  sub?: string;
}
