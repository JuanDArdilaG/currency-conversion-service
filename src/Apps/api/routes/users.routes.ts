import { Router } from "express";
import { AwilixContainer } from "awilix";
import { createAuthMiddleware } from "../middlewares/auth.middleware";
import { UsersController } from "../controllers/users.controller";

export function createUsersRouter(container: AwilixContainer): Router {
  const router = Router();
  const getUserInfoUseCase = container.resolve("getUserInfoUseCase");
  const usersController = new UsersController(
    getUserInfoUseCase,
    container.resolve("getAllUsersUseCase"),
    container.resolve("signupUserUseCase")
  );

  const authMiddleware = createAuthMiddleware(getUserInfoUseCase);

  router.get("/", authMiddleware, (req, res, next) =>
    usersController.getAllUsers(req, res, next)
  );

  router.get("/:userid", authMiddleware, (req, res, next) =>
    usersController.getUserInfo(req, res, next)
  );

  router.post("/signup", (req, res, next) =>
    usersController.signup(req, res, next)
  );

  return router;
}
