import {
  IRepository,
  IPaginatedRepository,
  PaginationResult,
} from "../../domain/persistence/repository";
import { PostgresDB } from "./postgres.db";

/**
 * PostgreSQL repository implementation base class
 * Provides common functionality for PostgreSQL-based repositories
 */
export abstract class PostgresRepository<T> implements IRepository<T> {
  constructor(
    protected readonly db: PostgresDB,
    protected readonly tableName: string,
    protected readonly idColumn: string = "id"
  ) {}

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<T | null> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ${this.idColumn} = $1
      LIMIT 1
    `;

    const result = await this.db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToDomain(result.rows[0]);
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await this.db.query(query);
    return result.rows.map((row) => this.mapToDomain(row));
  }

  /**
   * Save entity (create or update)
   * This is an abstract method since the implementation
   * depends on the specific entity structure
   */
  abstract persist(entity: T): Promise<void>;

  /**
   * Delete entity by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE ${this.idColumn} = $1
      RETURNING ${this.idColumn}
    `;

    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM ${this.tableName}
      WHERE ${this.idColumn} = $1
      LIMIT 1
    `;

    const result = await this.db.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Map a database record to a domain entity
   * Must be implemented by subclasses
   */
  protected abstract mapToDomain(record: any): T;
}

/**
 * PostgreSQL repository with pagination support
 */
export abstract class PaginatedPostgresRepository<T>
  extends PostgresRepository<T>
  implements IPaginatedRepository<T>
{
  /**
   * Find entities with pagination
   */
  async findPaginated(
    page: number,
    size: number
  ): Promise<PaginationResult<T>> {
    // Calculate offset based on page and size
    const offset = page * size;

    // Get paginated results
    const query = `
      SELECT * FROM ${this.tableName}
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;

    // Run both queries in parallel
    const [dataResult, countResult] = await Promise.all([
      this.db.query(query, [size, offset]),
      this.db.query(countQuery),
    ]);

    const items = dataResult.rows.map((row) => this.mapToDomain(row));
    const total = parseInt(countResult.rows[0].total, 10);
    const pages = Math.ceil(total / size);

    return {
      items,
      total,
      page,
      size,
      pages,
      hasNext: page < pages - 1,
      hasPrev: page > 0,
    };
  }
}
