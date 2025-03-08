import { UserID } from "../../../Users/domain/user-id.valueobject";
import { IConversionRepository } from "../../domain/conversion-repository.interface";
import { Conversion } from "../../domain/conversion.entity";

export class GetUserHistoryUseCase {
  constructor(private readonly conversionRepository: IConversionRepository) {}

  async execute(userId: UserID): Promise<Conversion[]> {
    return this.conversionRepository.findByUserId(userId);
  }
}
