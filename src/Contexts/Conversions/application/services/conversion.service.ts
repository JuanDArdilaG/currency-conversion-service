import { UserID } from "../../../Users/domain/user-id.valueobject";
import { Conversion } from "../../domain/conversion.entity";
import { IConversionService } from "../../domain/services/conversion-service.interface";
import { IExchangeRateService } from "../../domain/services/exchange-rate-service.interface";
import { Currency } from "../../domain/value-objects/currency.valueobject";
import { Money } from "../../domain/value-objects/money.valueobject";

export class ConversionService implements IConversionService {
  constructor(private readonly exchangeRateService: IExchangeRateService) {}

  async simpleConversion(
    userId: UserID,
    from: Currency,
    to: Currency,
    amount: Money
  ): Promise<Conversion> {
    if (amount.isZero()) return Conversion.withZeroAmount(userId, from, to);
    const rate = await this.exchangeRateService.getRate(from, to);

    const conversion = Conversion.convert(userId, from, to, amount, rate);

    return conversion;
  }
}
