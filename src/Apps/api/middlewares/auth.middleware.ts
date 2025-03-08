import { NextFunction, Request, Response } from "express";
import { GetUserInfoUseCase } from "../../../Contexts/Users/application/use-cases/get-user-info.usecase";
import { UserID } from "../../../Contexts/Users/domain/user-id.valueobject";

export interface WithUserIDRequest extends Request {
  userid?: string;
}

export const createAuthMiddleware =
  (getUserInfoUseCase: GetUserInfoUseCase) =>
  async (req: WithUserIDRequest, res: Response, next: NextFunction) => {
    const userid = req.headers.authorization;

    try {
      await getUserInfoUseCase.execute(new UserID(userid));
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized" });
    }

    req.userid = userid;

    next();
  };
