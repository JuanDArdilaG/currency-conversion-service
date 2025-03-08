import { Currency } from "../value-objects/currency.valueobject";
import { ExchangeRate } from "../value-objects/exchange-rate.valueobject";

export interface IExchangeRateService {
  getRate(from: Currency, to: Currency): Promise<ExchangeRate>;
}
