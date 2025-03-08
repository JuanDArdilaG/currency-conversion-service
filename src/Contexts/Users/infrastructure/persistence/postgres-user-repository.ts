import { PostgresRepository } from "../../../Shared/infrastructure/persistence/postgres.repository";
import { Config } from "../../../Shared/infrastructure/config/config";
import { PostgresDB } from "../../../Shared/infrastructure/persistence/postgres.db";
import { User } from "../../domain/user.entity";
import { IUsersRepository } from "../../domain/user-repository.interface";
import { UserEmail } from "../../domain/user-email.valueobject";
import { EntityNotFoundError } from "../../../Shared/domain/errors/not-found.error";
import { UserID } from "../../domain/user-id.valueobject";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export class PostgresUsersRepository
  extends PostgresRepository<User>
  implements IUsersRepository
{
  constructor(config: Config) {
    super(new PostgresDB(config), "users");
  }

  async persist(user: User): Promise<void> {
    const query = `
      INSERT INTO ${this.tableName}(
        id, name, email, created_at
      ) VALUES($1, $2, $3, $4)
    `;

    await this.db.query(query, [
      user.id.value,
      user.name,
      user.email.value,
      user.createdAt,
    ]);
  }

  async findByEmail(email: UserEmail): Promise<User> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = $1 LIMIT 1`;
    const result = await this.db.query(query, [email.value]);

    if (result.rows.length === 0) {
      throw new EntityNotFoundError("User", email.value);
    }

    return this.mapToDomain(result.rows[0]);
  }

  mapToDomain(record: UserRecord): User {
    return new User(
      new UserID(record.id),
      record.name,
      new UserEmail(record.email),
      record.created_at
    );
  }
}
