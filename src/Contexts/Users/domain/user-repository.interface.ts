import { User } from "./user.entity";
import { UserEmail } from "./user-email.valueobject";
import { IRepository } from "../../Shared/domain/persistence/repository";

export interface IUsersRepository extends IRepository<User> {
  findByEmail(email: UserEmail): Promise<User>;
}
