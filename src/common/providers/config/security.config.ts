import * as Joi from 'joi';
import { BaseConfig } from './base.config';

interface SecurityConfigProps {
  JWT_TOKEN_SECRET: string;
  JWT_TOKEN_EXPIRES_IN: number;
  DEFAULT_PASSPORT_STRATEGY: string;
}

export class SecurityConfig extends BaseConfig<SecurityConfigProps> {
  getSchema(): Joi.ObjectSchema<SecurityConfigProps> {
    return Joi.object({
      JWT_TOKEN_SECRET: Joi.string().required(),
      JWT_TOKEN_EXPIRES_IN: Joi.number().required(),
      DEFAULT_PASSPORT_STRATEGY: Joi.string().default('jwt')
    });
  }

  get jwtTokenSecret(): string {
    return this.config.JWT_TOKEN_SECRET;
  }

  get jwtTokenExpiresIn(): number {
    return this.config.JWT_TOKEN_EXPIRES_IN;
  }

  get defaultPassportStrategy(): string {
    return this.config.DEFAULT_PASSPORT_STRATEGY;
  }
}
