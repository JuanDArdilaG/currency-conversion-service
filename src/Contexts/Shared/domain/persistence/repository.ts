/**
 * Generic repository interface that defines common operations
 * for domain entities
 */
export interface IRepository<T> {
  /**
   * Find entity by its ID
   * @param id Entity identifier
   * @returns The entity if found, null otherwise
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities
   * @returns Array of all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Save an entity (create or update)
   * @param entity The entity to save
   * @returns The saved entity
   */
  persist(entity: T): Promise<void>;

  /**
   * Delete an entity by ID
   * @param id Entity identifier
   * @returns True if deleted, false if not found
   */
  deleteById(id: string): Promise<boolean>;

  /**
   * Check if an entity exists
   * @param id Entity identifier
   * @returns True if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;
}

/**
 * Extended repository interface with pagination support
 */
export interface IPaginatedRepository<T> extends IRepository<T> {
  /**
   * Find entities with pagination
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Paginated result with entities and metadata
   */
  findPaginated(page: number, size: number): Promise<PaginationResult<T>>;
}

/**
 * Pagination result structure
 */
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
