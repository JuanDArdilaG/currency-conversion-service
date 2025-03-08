import dotenv from "dotenv";
import { z } from "zod";

if (!process.env.NODE_ENV) throw new Error("NODE_ENV is not defined");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const ConfigSchema = z.object({
  database: z.object({
    host: z.string(),
    port: z.coerce.number().default(5432),
    username: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  redis: z.object({
    host: z.string(),
    port: z.coerce.number().default(6379),
    username: z.string().optional(),
    password: z.string().optional(),
    keyPrefix: z.string(),
  }),
  exchangeRate: z.object({
    fixerApiKey: z.string(),
    cacheExpirationMinutes: z.coerce.number().default(60),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  try {
    const config: Config = {
      database: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
      },
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME || "",
        password: process.env.REDIS_PASSWORD || "",
        keyPrefix: process.env.REDIS_KEY_PREFIX || "currency:",
      },
      exchangeRate: {
        fixerApiKey: process.env.FIXER_API_KEY || "",
        cacheExpirationMinutes:
          Number(process.env.FIXER_CACHE_EXPIRATION_MINUTES) || 60,
      },
    };

    return ConfigSchema.parse(config);
  } catch (error) {
    console.error("Configuration error:", error);
    throw new Error("Invalid configuration");
  }
}
