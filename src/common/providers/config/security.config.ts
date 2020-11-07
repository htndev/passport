import * as Joi from 'joi';
import { BaseConfig } from './base.config';

interface SecurityConfigProps {
  JWT_TOKEN_SECRET: string;
  JWT_TOKEN_EXPIRES_IN: number;
}

export class SecurityConfig extends BaseConfig<SecurityConfigProps> {
  getSchema(): Joi.ObjectSchema<SecurityConfigProps> {
    return Joi.object({
      JWT_TOKEN_SECRET: Joi.string().required(),
      JWT_TOKEN_EXPIRES_IN: Joi.number().required()
    });
  }

  get jwtTokenSecret(): string {
    return this.config.JWT_TOKEN_SECRET;
  }

  get jwtTokenExpiresIn(): number {
    return this.config.JWT_TOKEN_EXPIRES_IN;
  }
}
