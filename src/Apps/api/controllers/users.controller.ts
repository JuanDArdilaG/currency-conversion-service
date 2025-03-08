import { GetUserInfoUseCase } from "../../../Contexts/Users/application/use-cases/get-user-info.usecase";
import { Request, Response, NextFunction } from "express";
import { SignupUserUseCase } from "../../../Contexts/Users/application/use-cases/signup-user.usecase";
import { UserEmail } from "../../../Contexts/Users/domain/user-email.valueobject";
import { UserID } from "../../../Contexts/Users/domain/user-id.valueobject";
import { GetAllUsersUseCase } from "../../../Contexts/Users/application/use-cases/get-all-users.usecase";

export class UsersController {
  constructor(
    private readonly getUserInfoUseCase: GetUserInfoUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly signupUserUseCase: SignupUserUseCase
  ) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email } = req.body;

      const userCreated = await this.signupUserUseCase.execute(
        name,
        new UserEmail(email)
      );

      res.status(201).json(userCreated.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userid } = req.params;

      const user = await this.getUserInfoUseCase.execute(new UserID(userid));

      res.status(200).json(user.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.getAllUsersUseCase.execute();

      res.status(200).json(user.map((u) => u.toPrimitives()));
    } catch (error) {
      next(error);
    }
  }
}
