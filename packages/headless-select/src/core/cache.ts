import { SelectOption } from '@/core/types';

/**
 * Simple in-memory cache for asynchronous option loading.
 * @ignore
 * @title OptionsCache
 * @description Stores and retrieves results from `loadOptions` calls based on the search term to prevent redundant network requests.
 */
export class OptionsCache {
  private cache = new Map<string, SelectOption[]>();

  /**
   * Loads options through the provided loader function, or returns cached results if available.
   * @param {string} search - The search term used as the cache key.
   * @param {Function} loader - The asynchronous function to call on cache miss.
   * @returns {Promise<SelectOption[]>} - The loaded options.
   */
  async load(search: string, loader: () => Promise<SelectOption[]>): Promise<SelectOption[]> {
    if (this.cache.has(search)) {
      return this.cache.get(search)!;
    }

    const results = await loader();
    this.cache.set(search, results);
    return results;
  }

  /**
   * Checks if results for a given search query are present in the cache.
   * @param {string} search - The search query.
   * @returns {boolean} - True if cached, false otherwise.
   */
  has(search: string): boolean {
    return this.cache.has(search);
  }

  /**
   * Retrieves cached results for a given search query.
   * @param {string} search - The search query.
   * @returns {SelectOption[] | undefined} - The cached options, or undefined.
   */
  get(search: string): SelectOption[] | undefined {
    return this.cache.get(search);
  }

  /**
   * Clears all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }
}
