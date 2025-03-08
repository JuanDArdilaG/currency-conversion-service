import { IUsersRepository } from "../../domain/user-repository.interface";
import { User } from "../../domain/user.entity";

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
