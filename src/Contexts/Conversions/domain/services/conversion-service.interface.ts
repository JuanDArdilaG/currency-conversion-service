import { UserID } from "../../../Users/domain/user-id.valueobject";
import { Conversion } from "../conversion.entity";
import { Currency } from "../value-objects/currency.valueobject";
import { Money } from "../value-objects/money.valueobject";

export interface IConversionService {
  simpleConversion(
    userId: UserID,
    from: Currency,
    to: Currency,
    amount: Money
  ): Promise<Conversion>;
}
