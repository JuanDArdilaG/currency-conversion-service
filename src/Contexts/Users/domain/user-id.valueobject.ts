import { v4 } from "uuid";
import { InvalidArgumentError } from "../../Shared/domain/errors/invalid-argument.error";

export class UserID {
  constructor(public readonly value: string) {
    this.#validate();
  }

  static generate(): UserID {
    return new UserID(v4());
  }

  #validate() {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(this.value))
      throw new InvalidArgumentError(
        "UserId",
        this.value,
        "Invalid UUID format"
      );
  }
}
