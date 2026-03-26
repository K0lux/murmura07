import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis, type Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: RedisClient;

  constructor() {
    const url = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2
    });
  }

  getClient() {
    return this.client;
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await this.client.set(key, value);
  }

  async incr(key: string) {
    return this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number) {
    if (ttlSeconds > 0) {
      await this.client.expire(key, ttlSeconds);
    }
  }

  async ttl(key: string) {
    return this.client.ttl(key);
  }

  async ping() {
    return this.client.ping();
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
