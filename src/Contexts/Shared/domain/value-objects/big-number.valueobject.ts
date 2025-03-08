import { Big } from "big.js";

export abstract class BigNumber extends Big {
  get value(): string {
    return this.toString();
  }
}
