import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

import { NodeEnv } from './../../constants';

enum LogLevel {
  DEBUG = 'debug',
  VERBOSE = 'verbose',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error'
}

interface BaseConfigProps {
  NODE_ENV: string;
  LOG_LEVEL: string;
}

@Injectable()
export abstract class BaseConfig<T = any> {
  protected readonly config: Partial<T> = {};

  constructor() {
    const schema = this.getSchema().append({
      NODE_ENV: Joi.string().default(NodeEnv.DEVELOPMENT),
      LOG_LEVEL: Joi.string()
        .valid(LogLevel.DEBUG, LogLevel.ERROR, LogLevel.LOG, LogLevel.VERBOSE, LogLevel.WARN)
        .default(LogLevel.ERROR)
    });

    this.config = BaseConfig.validateConfig(process.env, schema);
  }

  abstract getSchema(): Joi.ObjectSchema;

  private static validateConfig(config: any, schema: Joi.ObjectSchema) {
    const { error, value } = schema.validate(config, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
  }

  get isDevMode(): boolean {
    return (this.config as Partial<BaseConfigProps>).NODE_ENV === NodeEnv.DEVELOPMENT;
  }

  get isDebugMode(): boolean {
    return (this.config as Partial<BaseConfigProps>).LOG_LEVEL === LogLevel.DEBUG;
  }
}
