import { BaseConfig } from './base.config';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';

interface AppConfigProps {
  PORT: number;
  ALLOWED_HEADERS: string;
  ALLOWED_DOMAINS: string;
  ENABLE_SWAGGER: boolean;
  APP_HOSTNAME: string;
  URL: string;
}

@Injectable()
export class AppConfig extends BaseConfig<AppConfigProps> {
  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      PORT: Joi.number().required(),
      ALLOWED_HEADERS: Joi.string().default('*'),
      ALLOWED_DOMAINS: Joi.string().default('*'),
      ENABLE_SWAGGER: Joi.boolean().default(true),
      APP_HOSTNAME: Joi.string().required()
    });
  }

  get port(): number {
    return this.config.PORT;
  }

  get allowedHeaders(): string[] {
    return this.config.ALLOWED_HEADERS.split(',');
  }

  get allowedDomains(): string[] {
    return this.config.ALLOWED_DOMAINS.split(',');
  }

  get enableSwagger(): boolean {
    return this.config.ENABLE_SWAGGER;
  }

  get appHostname(): string {
    return this.config.APP_HOSTNAME;
  }

  get isLocalhost(): boolean {
    return this.appHostname.includes('localhost');
  }

  get url(): string {
    const port = this.isLocalhost ? `:${this.port}` : '';

    return `https://${this.appHostname}${port}`;
  }
}
