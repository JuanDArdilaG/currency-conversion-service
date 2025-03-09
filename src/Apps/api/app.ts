import express from "express";
import cors from "cors";
import helmet from "helmet";
import { registerDependencies } from "../../Contexts/Shared/infrastructure/di/container";
import { createConversionsRouter } from "./routes/conversions.routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { createUsersRouter } from "./routes/users.routes";

async function bootstrap() {
  const apiVersion = "v1";
  const apiPrefix = `/api/${apiVersion}`;
  const container = registerDependencies();

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  app.use(`${apiPrefix}/conversions`, createConversionsRouter(container));
  app.use(`${apiPrefix}/users`, createUsersRouter(container));

  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});

export default bootstrap;
