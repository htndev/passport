import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { UUID } from '../../constants';
import { SecurityConfig } from '../config/security.config';
import { RedisWrapperService } from '../redis-wrapper/redis-wrapper.service';
import { RedisConfig } from './../config/redis.config';

@Injectable()
export class UuidService {
  readonly #logger = new Logger('UUID Service');
  constructor(
    private readonly redisWrapperService: RedisWrapperService,
    private readonly securityConfig: SecurityConfig,
    private readonly redisConfig: RedisConfig
  ) {}

  async registerUuid(): Promise<string> {
    const uuid = await this.generateUuid();
    await this.redisWrapperService.set(this.formatKey(uuid), 1, {
      expiryMode: 'EX',
      time: this.securityConfig.jwtRefreshTokenExpiresIn,
      setMode: 'NX'
    });

    this.#logger.verbose(`${uuid} successfully registered`);

    return uuid;
  }

  async deleteUuid(uuid: string): Promise<void> {
    await this.redisWrapperService.del(this.formatKey(uuid));
  }

  private async generateUuid(): Promise<string> {
    const _uuid = uuid();
    const isKeyExists = await this.redisWrapperService.exists(this.formatKey(_uuid));

    return !isKeyExists ? _uuid : this.generateUuid();
  }

  private formatKey(key: string) {
    return `${UUID}${this.redisConfig.redisSeparator}${key}`;
  }
}
