import { InvalidArgumentError } from "../../../Shared/domain/errors/invalid-argument.error";

export class Currency {
  constructor(readonly value: string) {
    this.#validate(value);
  }

  #validate(value: string) {
    if (!value)
      throw new InvalidArgumentError("Currency", value, "value is required");
    if (value.length !== 3)
      throw new InvalidArgumentError("Currency", value, "must be 3 characters");
  }

  static EUR(): Currency {
    return new Currency("EUR");
  }

  isEqualTo(other: Currency): boolean {
    return this.value === other.value;
  }
}
