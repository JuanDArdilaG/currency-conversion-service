import { IExchangeRateService } from "../../../domain/services/exchange-rate-service.interface";
import { IExchangeRateCache } from "../../../domain/services/exchange-rate.cache";
import { Currency } from "../../../domain/value-objects/currency.valueobject";
import { ExchangeRate } from "../../../domain/value-objects/exchange-rate.valueobject";
import { FailedToFetchExchangeRateException } from "./failed-to-fetch.exception";
import { FixerIOConfig } from "./fixerio-exchange-rate.config";

interface FixerResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export class FixerExchangeRateService implements IExchangeRateService {
  constructor(
    private fixerConfig: FixerIOConfig = FixerIOConfig.default(),
    private cacheService: IExchangeRateCache
  ) {}

  async getRate(from: Currency, to: Currency): Promise<ExchangeRate> {
    if (from.isEqualTo(to)) return ExchangeRate.one();

    const cachedRate = await this.cacheService.getExchangeRate(from, to);
    if (cachedRate !== null) {
      console.log("rate from cache", { from, to, rate: cachedRate.value });
      return cachedRate;
    }

    console.log("no cache hit, fetching rate from api");

    if (from.isEqualTo(this.fixerConfig.baseCurrency)) {
      const response = await this.#fetchRate(to.value);
      const rate = ExchangeRate.fromNumber(response.rates[to.value]);

      await this.cacheService.setExchangeRate(from, to, rate);
      return rate;
    } else if (to.isEqualTo(this.fixerConfig.baseCurrency)) {
      const response = await this.#fetchRate(from.value);
      const rate = ExchangeRate.fromNumber(1 / response.rates[from.value]);

      await this.cacheService.setExchangeRate(from, to, rate);
      return rate;
    } else {
      const response = await this.#fetchRates([from.value, to.value]);
      const fromToBaseRate = 1 / response.rates[from.value];
      const baseToToRate = response.rates[to.value];
      const rate = ExchangeRate.fromNumber(fromToBaseRate * baseToToRate);

      await this.cacheService.setExchangeRate(from, to, rate);
      return rate;
    }
  }

  async #fetchRate(symbol: string): Promise<FixerResponse> {
    try {
      const response = await (
        await fetch(
          `${this.fixerConfig.baseUrl}?access_key=${this.fixerConfig.apiKey}&symbols=${symbol}`
        )
      ).json();

      if (!response.success) {
        throw new FailedToFetchExchangeRateException(response);
      }

      return response;
    } catch (error) {
      throw new Error(`Exchange rate service error: ${error.message}`);
    }
  }

  async #fetchRates(symbols: string[]): Promise<FixerResponse> {
    try {
      const response = await (
        await fetch(
          `${this.fixerConfig.baseUrl}?access_key=${
            this.fixerConfig.apiKey
          }&symbols=${symbols.join(",")}`
        )
      ).json();

      if (!response.success) {
        throw new FailedToFetchExchangeRateException(response);
      }

      return response;
    } catch (error) {
      throw new Error(`Exchange rate service error: ${error.message}`);
    }
  }
}
