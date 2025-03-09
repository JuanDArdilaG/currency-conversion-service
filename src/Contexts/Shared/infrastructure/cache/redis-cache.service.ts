import { createClient, RedisClientType } from "redis";
import { CacheService } from "../../domain/services/cache.service";

export class RedisCacheConfig {
  constructor(
    readonly host: string,
    readonly port: number,
    readonly db: string,
    readonly keyPrefix: string,
    readonly defaultTtlSeconds: number,
    readonly username?: string,
    readonly password?: string
  ) {
    this.#validate();
  }

  #validate() {
    if (!this.host) {
      throw new Error("Redis host is required");
    }
    if (!this.port) {
      throw new Error("Redis port is required");
    }
    if (!this.db) {
      throw new Error("Redis db is required");
    }
    if (!this.defaultTtlSeconds) {
      throw new Error("Redis default TTL is required");
    }
    if (!this.keyPrefix) {
      throw new Error("Redis key prefix is required");
    }
    if (this.defaultTtlSeconds < 0) {
      throw new Error("Redis default TTL cannot be negative");
    }
  }
}

export abstract class RedisCacheService<T> implements CacheService<T> {
  private client: RedisClientType;

  constructor(private readonly redisConfig: RedisCacheConfig) {
    this.client = createClient({
      url: `redis://${
        redisConfig.username && redisConfig.password
          ? `${redisConfig.username}:${redisConfig.password}@`
          : ""
      }${redisConfig.host}:${redisConfig.port}`,
    });
    this.client.connect();
  }

  async get(key: string): Promise<T | null> {
    const result = await this.client.get(key);

    if (!result) {
      return null;
    }

    try {
      return JSON.parse(result) as T;
    } catch (error) {
      return result as unknown as T;
    }
  }

  async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    const ttl = ttlSeconds ?? this.redisConfig.defaultTtlSeconds;

    if (ttl) {
      await this.client.set(key, serializedValue, { EX: ttl });
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async clear(): Promise<void> {
    if (this.redisConfig.keyPrefix) {
      const keys = await this.client.keys(`${this.redisConfig.keyPrefix}*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } else {
      // Without a prefix, flush the entire DB (be careful!)
      await this.client.flushDb();
    }
  }

  disconnect(): void {
    this.client.disconnect();
  }
}
