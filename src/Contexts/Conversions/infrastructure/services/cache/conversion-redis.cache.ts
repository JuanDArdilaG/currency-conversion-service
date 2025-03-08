import {
  RedisCacheConfig,
  RedisCacheService,
} from "../../../../Shared/infrastructure/cache/redis-cache.service";
import { Config } from "../../../../Shared/infrastructure/config/config";
import { IExchangeRateCache } from "../../../domain/services/exchange-rate.cache";
import { Currency } from "../../../domain/value-objects/currency.valueobject";
import { ExchangeRate } from "../../../domain/value-objects/exchange-rate.valueobject";

export class RedisExchangeRateCache
  extends RedisCacheService<string>
  implements IExchangeRateCache
{
  private readonly rateKeyPrefix = "exchange-rate:";

  constructor(config: Config) {
    super(
      new RedisCacheConfig(
        config.redis.host,
        config.redis.port,
        "conversions",
        config.redis.keyPrefix,
        config.exchangeRate.cacheExpirationMinutes * 60,
        config.redis.username,
        config.redis.password
      )
    );
  }

  /**
   * Get cached exchange rate
   * @param from Source currency
   * @param to Target currency
   * @returns The cached exchange rate or null if not found
   */
  async getExchangeRate(
    from: Currency,
    to: Currency
  ): Promise<ExchangeRate | null> {
    const key = this.getRateKey(from, to);
    const value = await this.get(key);

    return value ? ExchangeRate.fromString(value) : null;
  }

  /**
   * Cache an exchange rate
   * @param from Source currency
   * @param to Target currency
   * @param rate Exchange rate value
   */
  async setExchangeRate(
    from: Currency,
    to: Currency,
    rate: ExchangeRate
  ): Promise<void> {
    const key = this.getRateKey(from, to);
    await this.set(key, rate.value);
  }

  /**
   * Delete a cached exchange rate
   * @param from Source currency
   * @param to Target currency
   */
  async deleteExchangeRate(from: Currency, to: Currency): Promise<void> {
    const key = this.getRateKey(from, to);
    await this.delete(key);
  }

  /**
   * Generate a consistent cache key for exchange rates
   */
  private getRateKey(from: Currency, to: Currency): string {
    return `${this.rateKeyPrefix}${from.value}-${to.value}`;
  }
}
