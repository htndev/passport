import { Injectable } from '@nestjs/common';
import { KeyType, Ok, Redis, ValueType } from 'ioredis';
import { isEmpty } from 'lodash';
import { RedisService } from 'nestjs-redis';

import { MicroserviceToken, Nullable, TokenType } from '../../types';
import { mapAsync } from '../../utils/async-iterators.util';
import { MICROSERVICES, TOKEN_PREFIX } from './../../constants';
import { RedisConfig } from './../config/redis.config';

type SetOptions = {
  expiryMode?: 'EX' | 'PX';
  time?: number;
  setMode?: 'NX' | 'XX';
};

@Injectable()
export class RedisWrapperService {
  constructor(private readonly redisService: RedisService, private readonly redisConfig: RedisConfig) {}

  async getClient(): Promise<Redis> {
    return this.redisService.getClient(this.redisConfig.name);
  }

  async get(key: KeyType): Promise<Nullable<string>> {
    const client = await this.getClient();

    return client.get(key);
  }

  async set(key: KeyType, value: ValueType, options?: SetOptions): Promise<Nullable<Ok>> {
    const client = await this.getClient();

    if (!options || isEmpty(options)) {
      return client.set(key, value);
    } else if (options.expiryMode && options.time && options.setMode) {
      return client.set(key, value, options.expiryMode, options.time, options.setMode);
    } else if (options.expiryMode && options.time) {
      return client.set(key, value, options.expiryMode, options.time);
    } else if (options.expiryMode) {
      return client.set(key, value, options.expiryMode);
    }
  }

  async hset(key: KeyType, value: Map<string, any>): Promise<Ok> {
    const client = await this.getClient();

    return client.hset(key, value);
  }

  async hget(key: KeyType, field: string): Promise<string> {
    const client = await this.getClient();

    return client.hget(key, field);
  }

  async exists(key: KeyType): Promise<boolean> {
    const client = await this.getClient();
    const exists = await client.exists(key);

    return exists > 0;
  }

  async del(key: KeyType): Promise<boolean> {
    const client = await this.getClient();
    const isDeleted = await client.del(key);

    return isDeleted > 0;
  }

  async setToken(uuid: string, tokenType: TokenType, token: string, expires: number): Promise<void> {
    await this.set(this.formatKey(uuid, tokenType), token, {
      expiryMode: 'EX',
      time: expires,
      setMode: 'NX'
    });
  }

  async getToken(uuid: string, tokenType: TokenType): Promise<Nullable<string>> {
    return this.get(this.formatKey(uuid, tokenType));
  }

  async getAvailableTokens(uuid: string): Promise<MicroserviceToken> {
    const storedTokens = await mapAsync(MICROSERVICES, async (microservice: TokenType) => ({
      [microservice]: await this.get(this.formatKey(uuid, microservice))
    }));

    const tokens = storedTokens
      .filter((token) => {
        const [value] = Object.values(token);
        return !!value;
      })
      .reduce((acc, item) => {
        const [service, token] = Object.entries(item)[0];
        return {
          ...acc,
          [service]: token
        };
      }, {});

    return tokens;
  }

  async deleteToken(uuid: string, tokenType: TokenType): Promise<boolean> {
    return this.del(this.formatKey(uuid, tokenType));
  }

  private formatKey = (uuid: string, tokenType: TokenType): string =>
    `${TOKEN_PREFIX}${this.redisConfig.redisSeparator}${uuid}${this.redisConfig.redisSeparator}${tokenType}`;
}
