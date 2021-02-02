import { Injectable } from '@nestjs/common';
import Joi = require('joi');
import { BaseConfig } from './base.config';

interface MicroservicesConfigProps {
  CLIENT_ID: string;
  CLIENT_PLAYER: string;
  CLIENT_HOMEPAGE: string;
}

@Injectable()
export class MicroservicesConfig extends BaseConfig<MicroservicesConfigProps> {
  getSchema() {
    return Joi.object({
      CLIENT_ID: Joi.string().required(),
      CLIENT_PLAYER: Joi.string().required(),
      CLIENT_HOMEPAGE: Joi.string().required()
    });
  }

  get id(): string {
    return this.config.CLIENT_ID;
  }

  get player(): string {
    return this.config.CLIENT_PLAYER;
  }

  get homepage(): string {
    return this.config.CLIENT_HOMEPAGE;
  }
}
