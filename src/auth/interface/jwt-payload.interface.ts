import { AuthScope } from './../../common/constants';
export interface JwtPayload {
  username: string;
  email: string;
  scope: string;
  authority: AuthScope;
}