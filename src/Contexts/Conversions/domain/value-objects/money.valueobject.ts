import { InvalidArgumentError } from "../../../Shared/domain/errors/invalid-argument.error";
import { BigNumber } from "../../../Shared/domain/value-objects/big-number.valueobject";
import { ExchangeRate } from "./exchange-rate.valueobject";

export class Money extends BigNumber {
  constructor(value: string) {
    super(value);
    this.#validate();
  }

  #validate() {
    if (!this.value)
      throw new InvalidArgumentError("Money", this.value, "is required");
  }

  static fromNumber(value: number): Money {
    return new Money(String(value));
  }

  static fromString(value: string): Money {
    return new Money(value);
  }

  applyExchangeRate(exchangeRate: ExchangeRate): Money {
    return new Money(this.times(exchangeRate).toString());
  }

  isZero(): boolean {
    return this.eq(0);
  }
}
