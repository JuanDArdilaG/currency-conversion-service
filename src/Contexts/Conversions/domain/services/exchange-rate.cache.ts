import { Currency } from "../value-objects/currency.valueobject";
import { ExchangeRate } from "../value-objects/exchange-rate.valueobject";

export interface IExchangeRateCache {
  getExchangeRate(from: Currency, to: Currency): Promise<ExchangeRate | null>;
  setExchangeRate(
    from: Currency,
    to: Currency,
    rate: ExchangeRate
  ): Promise<void>;
}
