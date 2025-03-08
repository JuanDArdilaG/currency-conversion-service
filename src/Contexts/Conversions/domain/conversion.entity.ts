import { v4 } from "uuid";
import { Currency } from "./value-objects/currency.valueobject";
import { Money } from "./value-objects/money.valueobject";
import { UserID } from "../../Users/domain/user-id.valueobject";
import { ExchangeRate } from "./value-objects/exchange-rate.valueobject";

export class Conversion {
  constructor(
    public id: string,
    public userId: UserID,
    public from: Currency,
    public to: Currency,
    public originalAmount: Money,
    public convertedAmount: Money,
    public exchangeRate: ExchangeRate,
    public createdAt: Date
  ) {}

  static convert(
    userId: UserID,
    fromCurrency: Currency,
    toCurrency: Currency,
    originalAmount: Money,
    exchangeRate: ExchangeRate
  ): Conversion {
    return new Conversion(
      v4(),
      userId,
      fromCurrency,
      toCurrency,
      originalAmount,
      originalAmount.applyExchangeRate(exchangeRate),
      exchangeRate,
      new Date()
    );
  }

  static withZeroAmount(
    userId: UserID,
    from: Currency,
    to: Currency
  ): Conversion {
    return new Conversion(
      v4(),
      userId,
      from,
      to,
      Money.fromNumber(0),
      Money.fromNumber(0),
      ExchangeRate.one(),
      new Date()
    );
  }

  toPrimitives(): ConversionPrimitives {
    return {
      id: this.id,
      userId: this.userId.value,
      from: this.from.value,
      to: this.to.value,
      originalAmount: this.originalAmount.value,
      convertedAmount: this.convertedAmount.value,
      exchangeRate: this.exchangeRate.value,
      createdAt: this.createdAt,
    };
  }
}

export type ConversionPrimitives = {
  id: string;
  userId: string;
  from: string;
  to: string;
  originalAmount: string;
  convertedAmount: string;
  exchangeRate: string;
  createdAt: Date;
};
