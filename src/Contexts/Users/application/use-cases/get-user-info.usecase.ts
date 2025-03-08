import { EntityNotFoundError } from "../../../Shared/domain/errors/not-found.error";
import { UserID } from "../../domain/user-id.valueobject";
import { IUsersRepository } from "../../domain/user-repository.interface";
import { User } from "../../domain/user.entity";

export class GetUserInfoUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(id: UserID): Promise<User> {
    const user = await this.userRepository.findById(id.value);

    if (!user) throw new EntityNotFoundError("User", id.value);

    return user;
  }
}
