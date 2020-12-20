export interface BaseUserJwtPayload {
  username: string;
  email: string;
}

export interface JwtPayload extends BaseUserJwtPayload {
  scope?: string;
  iss?: string;
  iat?: number;
  exp?: number;
  sub?: string;
}
