import { IRepository } from "../../Shared/domain/persistence/repository";
import { UserID } from "../../Users/domain/user-id.valueobject";
import { Conversion } from "./conversion.entity";

export interface IConversionRepository extends IRepository<Conversion> {
  findByUserId(userId: UserID): Promise<Conversion[]>;
}
