import { InvalidArgumentError } from "../../Shared/domain/errors/invalid-argument.error";

export class UserEmail {
  constructor(readonly value: string) {
    this.#validate(value);
  }

  #validate(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new InvalidArgumentError(
        "UserEmail",
        value,
        "Invalid email format"
      );
    }
  }
}
