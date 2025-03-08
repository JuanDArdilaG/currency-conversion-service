export interface CacheService<T> {
  /**
   * Get a value from cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  get(key: string): Promise<T | null>;

  /**
   * Set a value in cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttlSeconds Optional TTL in seconds
   */
  set(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Delete a value from cache
   * @param key The cache key
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a key exists in cache
   * @param key The cache key
   */
  exists(key: string): Promise<boolean>;

  /**
   * Clear all cache entries
   */
  clear(): Promise<void>;
}
