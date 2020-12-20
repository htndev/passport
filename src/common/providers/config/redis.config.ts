import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

import { BaseConfig } from './base.config';

interface RedisConfigProps {
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_KEY_PREFIX: string;
  REDIS_NAME: string;
  REDIS_RETRY_STRATEGY: number;
  REDIS_SEPARATOR: string;
}

@Injectable()
export class RedisConfig extends BaseConfig<RedisConfigProps> {
  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      REDIS_HOST: Joi.string().required(),
      REDIS_PORT: Joi.number().default(6379),
      REDIS_PASSWORD: Joi.string().required(),
      REDIS_NAME: Joi.string().default('passport'),
      REDIS_KEY_PREFIX: Joi.string().default('passport'),
      REDIS_RETRY_STRATEGY: Joi.number().default(5),
      REDIS_SEPARATOR: Joi.string().default(':')
    });
  }

  get port(): number {
    return this.config.REDIS_PORT;
  }

  get host(): string {
    return this.config.REDIS_HOST;
  }

  get password(): string {
    return this.config.REDIS_PASSWORD;
  }

  get keyPrefix(): string {
    return this.config.REDIS_KEY_PREFIX;
  }

  get name(): string {
    return this.config.REDIS_NAME;
  }

  get redisSeparator(): string {
    return this.config.REDIS_SEPARATOR;
  }
}
