import { PostgresRepository } from "../../../Shared/infrastructure/persistence/postgres.repository";
import { IConversionRepository } from "../../domain/conversion-repository.interface";
import { Config } from "../../../Shared/infrastructure/config/config";
import { PostgresDB } from "../../../Shared/infrastructure/persistence/postgres.db";
import { Conversion } from "../../domain/conversion.entity";
import { Currency } from "../../domain/value-objects/currency.valueobject";
import { Money } from "../../domain/value-objects/money.valueobject";
import { UserID } from "../../../Users/domain/user-id.valueobject";
import { ExchangeRate } from "../../domain/value-objects/exchange-rate.valueobject";

interface ConversionRecord {
  id: string;
  user_id: string;
  original_amount: number;
  from_currency: string;
  to_currency: string;
  converted_amount: number;
  exchange_rate: number;
  created_at: Date;
}

export class PostgresConversionRepository
  extends PostgresRepository<Conversion>
  implements IConversionRepository
{
  constructor(config: Config) {
    super(new PostgresDB(config), "conversions");
  }

  async persist(conversion: Conversion): Promise<void> {
    const query = `
      INSERT INTO ${this.tableName}(
        id, user_id, original_amount, from_currency, to_currency, converted_amount, exchange_rate, created_at
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await this.db.query(query, [
      conversion.id,
      conversion.userId.value,
      conversion.originalAmount.value,
      conversion.from.value,
      conversion.to.value,
      conversion.convertedAmount.value,
      conversion.exchangeRate.value,
      conversion.createdAt,
    ]);
  }

  async findByUserId(userId: UserID): Promise<Conversion[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this.db.query(query, [userId.value]);
    return result.rows.map(this.mapToDomain);
  }

  mapToDomain(record: ConversionRecord): Conversion {
    return new Conversion(
      record.id,
      new UserID(record.user_id),
      new Currency(record.from_currency),
      new Currency(record.to_currency),
      Money.fromNumber(record.original_amount),
      Money.fromNumber(record.converted_amount),
      ExchangeRate.fromNumber(record.exchange_rate),
      record.created_at
    );
  }
}
