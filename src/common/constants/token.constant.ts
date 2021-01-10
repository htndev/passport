import { MICROSERVICES } from './microservice.constant';
import { TokenType } from './type.constant';

export const TOKEN_PREFIX = 'token';

export const REFRESH_TOKEN = 'refresh';

export const TOKENS: TokenType[] = [...MICROSERVICES, REFRESH_TOKEN];