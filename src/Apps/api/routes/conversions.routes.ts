import { Router } from "express";
import { AwilixContainer } from "awilix";
import { ConversionsController } from "../controllers/conversions.controller";
import { createAuthMiddleware } from "../middlewares/auth.middleware";

export function createConversionsRouter(container: AwilixContainer): Router {
  const router = Router();
  const conversionsController = new ConversionsController(
    container.resolve("convertCurrencyUseCase"),
    container.resolve("getUserHistoryUseCase")
  );

  const authMiddleware = createAuthMiddleware(
    container.resolve("getUserInfoUseCase")
  );

  router.use(authMiddleware);

  router.post("/convert", (req, res, next) =>
    conversionsController.convert(req, res, next)
  );

  router.get("/history", (req, res, next) =>
    conversionsController.getHistory(req, res, next)
  );

  return router;
}
