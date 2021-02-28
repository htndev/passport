import { ApiEndpoint } from '@xbeat/toolkit';
import * as Joi from 'joi';
import { BaseConfig } from '@xbeat/server-toolkit';

interface SecurityConfigProps {
  COOKIE_SECRET: string;
  JWT_PASSPORT_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_MEDIA_TOKEN_SECRET: string;
  JWT_STUDIO_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES_IN: number;
  JWT_REFRESH_TOKEN_EXPIRES_IN: number;
  DEFAULT_PASSPORT_STRATEGY: string;
}

export class SecurityConfig extends BaseConfig<SecurityConfigProps> {
  getSchema(): Joi.ObjectSchema<SecurityConfigProps> {
    return Joi.object({
      COOKIE_SECRET: Joi.string().required(),
      JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
      JWT_PASSPORT_TOKEN_SECRET: Joi.string().required(),
      JWT_MEDIA_TOKEN_SECRET: Joi.string().required(),
      JWT_STUDIO_TOKEN_SECRET: Joi.string().required(),
      JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
      JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
      DEFAULT_PASSPORT_STRATEGY: Joi.string().default('jwt')
    });
  }

  get cookieSecret(): string {
    return this.config.COOKIE_SECRET;
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

  get jwtSecret(): string {
    return this.jwtPassportTokenSecret;
  }

  getMicroserviceToken(service: ApiEndpoint): string {
    switch (service) {
      case ApiEndpoint.Passport: {
        return this.jwtPassportTokenSecret;
      }
      case ApiEndpoint.Media: {
        return this.jwtMediaTokenSecret;
      }
      case ApiEndpoint.Studio: {
        return this.jwtStudioTokenSecret;
      }
      default: {
        throw new Error(`Microservice with name ${service} not found`);
      }
    }
  }
}
