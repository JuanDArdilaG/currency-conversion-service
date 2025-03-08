import { Response, NextFunction } from "express";
import { ConvertCurrencyUseCase } from "../../../Contexts/Conversions/application/use-cases/convert-currency.usecase";
import { GetUserHistoryUseCase } from "../../../Contexts/Conversions/application/use-cases/get-user-history.usecase";
import { Money } from "../../../Contexts/Conversions/domain/value-objects/money.valueobject";
import { Currency } from "../../../Contexts/Conversions/domain/value-objects/currency.valueobject";
import { WithUserIDRequest } from "../middlewares/auth.middleware";
import { UserID } from "../../../Contexts/Users/domain/user-id.valueobject";

export class ConversionsController {
  constructor(
    private readonly convertCurrencyUseCase: ConvertCurrencyUseCase,
    private readonly getUserHistoryUseCase: GetUserHistoryUseCase
  ) {}

  async convert(
    req: WithUserIDRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userid = req.userid;
      const { amount, from, to } = req.body;

      const conversion = await this.convertCurrencyUseCase.execute({
        userID: new UserID(userid),
        amount: new Money(amount),
        from: new Currency(from),
        to: new Currency(to),
      });

      res.status(200).json(conversion.toPrimitives());
    } catch (error) {
      next(error);
    }
  }

  async getHistory(
    req: WithUserIDRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userid = req.userid;

      const conversions = await this.getUserHistoryUseCase.execute(
        new UserID(userid)
      );

      res.status(200).json({
        history: conversions.map((c) => c.toPrimitives()),
      });
    } catch (error) {
      next(error);
    }
  }
}
