import { IConversionRepository } from "../../domain/conversion-repository.interface";
import { Conversion } from "../../domain/conversion.entity";
import { IConversionService } from "../../domain/services/conversion-service.interface";
import { Currency } from "../../domain/value-objects/currency.valueobject";
import { Money } from "../../domain/value-objects/money.valueobject";
import { UserID } from "../../../Users/domain/user-id.valueobject";

export type ConvertCurrencyUseCaseInput = {
  userID: UserID;
  amount: Money;
  from: Currency;
  to: Currency;
};

export class ConvertCurrencyUseCase {
  constructor(
    private readonly conversionService: IConversionService,
    private readonly conversionRepository: IConversionRepository
  ) {}

  async execute({
    userID,
    from,
    to,
    amount,
  }: ConvertCurrencyUseCaseInput): Promise<Conversion> {
    const conversion = await this.conversionService.simpleConversion(
      userID,
      from,
      to,
      amount
    );

    await this.conversionRepository.persist(conversion);

    return conversion;
  }
}
