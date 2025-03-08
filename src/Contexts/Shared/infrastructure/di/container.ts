import {
  createContainer,
  asClass,
  asValue,
  InjectionMode,
  AwilixContainer,
} from "awilix";
import { loadConfig } from "../config/config";
import { RedisExchangeRateCache } from "../../../Conversions/infrastructure/services/cache/conversion-redis.cache";
import { FixerExchangeRateService } from "../../../Conversions/infrastructure/services/exchange-rate/fixerio-exchange-rate.service";
import { PostgresConversionRepository } from "../../../Conversions/infrastructure/persistence/postgres-conversion.repository";
import { ConversionService } from "../../../Conversions/application/services/conversion.service";
import { ConvertCurrencyUseCase } from "../../../Conversions/application/use-cases/convert-currency.usecase";
import { GetUserHistoryUseCase } from "../../../Conversions/application/use-cases/get-user-history.usecase";
import { GetUserInfoUseCase } from "../../../Users/application/use-cases/get-user-info.usecase";
import { PostgresUsersRepository } from "../../../Users/infrastructure/persistence/postgres-user-repository";
import { SignupUserUseCase } from "../../../Users/application/use-cases/signup-user.usecase";
import { GetAllUsersUseCase } from "../../../Users/application/use-cases/get-all-users.usecase";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

export function registerDependencies(): AwilixContainer {
  const config = loadConfig();

  container.register({
    config: asValue(config),
  });

  container.register({
    cacheService: asClass(RedisExchangeRateCache).singleton(),
  });

  container.register({
    exchangeRateService: asClass(FixerExchangeRateService).singleton(),
    conversionRepository: asClass(PostgresConversionRepository).singleton(),
    conversionService: asClass(ConversionService).singleton(),
    convertCurrencyUseCase: asClass(ConvertCurrencyUseCase).singleton(),
    getUserHistoryUseCase: asClass(GetUserHistoryUseCase).singleton(),
  });

  container.register({
    getUserInfoUseCase: asClass(GetUserInfoUseCase).singleton(),
    getAllUsersUseCase: asClass(GetAllUsersUseCase).singleton(),
    signupUserUseCase: asClass(SignupUserUseCase).singleton(),
    userRepository: asClass(PostgresUsersRepository).singleton(),
  });

  return container;
}

export default container;
