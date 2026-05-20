import { SelectOption } from '@/core/types';

export class OptionsCache {
  private cache = new Map<string, SelectOption[]>();

  async load(search: string, loader: () => Promise<SelectOption[]>): Promise<SelectOption[]> {
    if (this.cache.has(search)) {
      return this.cache.get(search)!;
    }

    const results = await loader();
    this.cache.set(search, results);
    return results;
  }

  clear(): void {
    this.cache.clear();
  }
}
