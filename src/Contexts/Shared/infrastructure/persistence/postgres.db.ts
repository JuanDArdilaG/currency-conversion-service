import { Pool } from "pg";
import { Config } from "../config/config";

export class PostgresDB {
  private pool: Pool;

  constructor(config: Config) {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.username,
      password: config.database.password,
      database: config.database.database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });
  }

  getPool(): Pool {
    return this.pool;
  }

  async query(text: string, params: any[] = []): Promise<any> {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
  }

  async getClient() {
    const client = await this.pool.connect();
    const query = client.query;
    const release = client.release;

    // It comes from official documentation
    const timeout = setTimeout(() => {
      console.error("A client has been checked out for more than 5 seconds!");
      console.error(
        // @ts-ignore
        `The last executed query on this client was: ${client.lastQuery}`
      );
    }, 5000);

    client.query = async (...args: any[]) => {
      // @ts-ignore
      client.lastQuery = args;
      return query.apply(client, args);
    };

    client.release = () => {
      clearTimeout(timeout);

      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
