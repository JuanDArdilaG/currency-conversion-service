import { InvalidArgumentError } from "../../../Shared/domain/errors/invalid-argument.error";
import { BigNumber } from "../../../Shared/domain/value-objects/big-number.valueobject";

export class ExchangeRate extends BigNumber {
  constructor(value: string) {
    super(value);
    this.#validate();
  }

  #validate() {
    if (!this.value)
      throw new InvalidArgumentError("ExchangeRate", this.value, "is required");
  }

  static fromNumber(value: number): ExchangeRate {
    return new ExchangeRate(String(value));
  }

  static fromString(value: string): ExchangeRate {
    return new ExchangeRate(value);
  }

  static one(): ExchangeRate {
    return new ExchangeRate("1");
  }
}
