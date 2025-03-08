import { Currency } from "../../../domain/value-objects/currency.valueobject";

export class FixerIOConfig {
  constructor(
    readonly apiKey: string,
    readonly baseUrl: string,
    readonly baseCurrency: Currency,
    readonly cacheTtlMinutes: number
  ) {
    this.#validate();
  }

  #validate(): void {
    if (!this.apiKey) {
      throw new Error("ExchangeRate API key is required");
    }

    if (!this.baseUrl) {
      throw new Error("ExchangeRate API base URL is required");
    }

    if (!this.baseCurrency) {
      throw new Error("ExchangeRate base currency is required");
    }

    if (this.cacheTtlMinutes < 0) {
      throw new Error("Cache TTL must be a non-negative number");
    }
  }

  static default(): FixerIOConfig {
    return new FixerIOConfig(
      process.env.FIXER_API_KEY || "",
      "http://data.fixer.io/api/latest",
      Currency.EUR(), //default and fixed for free plan
      60
    );
  }
}
