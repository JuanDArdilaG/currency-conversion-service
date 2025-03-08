import { IUsersRepository } from "../../domain/user-repository.interface";
import { User } from "../../domain/user.entity";
import { UserEmail } from "../../domain/user-email.valueobject";

export class SignupUserUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(name: string, email: UserEmail): Promise<User> {
    const user = User.create(name, email);

    await this.userRepository.persist(user);

    return user;
  }
}
