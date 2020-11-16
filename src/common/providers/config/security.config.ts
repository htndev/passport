import { Microservice } from './../../constants';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

interface SecurityConfigProps {
  JWT_PASSPORT_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_MEDIA_TOKEN_SECRET: string;
  JWT_STUDIO_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: number;
  JWT_REFRESH_TOKEN_EXPIRES_IN: number;
  DEFAULT_PASSPORT_STRATEGY: string;
  TOKEN_PREFIX: string;
}

export class SecurityConfig extends BaseConfig<SecurityConfigProps> {
  getSchema(): Joi.ObjectSchema<SecurityConfigProps> {
    return Joi.object({
      JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
      JWT_PASSPORT_TOKEN_SECRET: Joi.string().required(),
      JWT_MEDIA_TOKEN_SECRET: Joi.string().required(),
      JWT_STUDIO_TOKEN_SECRET: Joi.string().required(),
      JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
      JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
      DEFAULT_PASSPORT_STRATEGY: Joi.string().default('jwt'),
      TOKEN_PREFIX: Joi.string().default('token.')
    });
  }

  get jwtPassportTokenSecret(): string {
    return this.config.JWT_PASSPORT_TOKEN_SECRET;
  }

  get jwtMediaTokenSecret(): string {
    return this.config.JWT_MEDIA_TOKEN_SECRET;
  }

  get jwtStudioTokenSecret(): string {
    return this.config.JWT_STUDIO_TOKEN_SECRET;
  }

  get jwtAccessTokenExpiresIn(): number {
    return this.config.JWT_ACCESS_TOKEN_EXPIRES_IN;
  }

  get jwtRefreshTokenSecret(): string {
    return this.config.JWT_REFRESH_TOKEN_SECRET;
  }

  get jwtRefreshTokenExpiresIn(): number {
    return this.config.JWT_REFRESH_TOKEN_EXPIRES_IN;
  }

  get defaultPassportStrategy(): string {
    return this.config.DEFAULT_PASSPORT_STRATEGY;
  }

  get tokenPrefix(): string {
    return this.config.TOKEN_PREFIX;
  }

  getMicroserviceToken(service: Microservice): string {
    switch(service) {
      case Microservice.PASSPORT: {
        return this.jwtPassportTokenSecret;
      }
      case Microservice.MEDIA: {
        return this.jwtMediaTokenSecret;
      }
      case Microservice.STUDIO: {
        return this.jwtStudioTokenSecret;
      }
      default: {
        throw new Error(`Microservice with name ${service} not found`);
      }
    }
  }
}
