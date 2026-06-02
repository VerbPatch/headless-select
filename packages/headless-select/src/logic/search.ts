import { computeVisibleOptions, computeCanCreate, mergeOptions } from '@/utils/index';
import type { SelectContext } from '@/core/context';
import type { OptionsCache } from '@/core/cache';

/**
 * Factory for search and asynchronous loading actions.
 * @group logic
 * @title createSearchActions
 * @description Manages internal search state, client-side filtering, and debounced asynchronous option loading.
 * @param {SelectContext} ctx - The internal select context.
 * @param {OptionsCache} cache - Cache instance for storing async results.
 * @returns {SearchActions} - Object containing search actions.
 */
export function createSearchActions(ctx: SelectContext, cache: OptionsCache) {
  let latestSearchQuery = '';
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debouncedLoad = {
    call: (search: string) => {
      if (timer) clearTimeout(timer);
      const delay = ctx.getConfig().searchDelay ?? 300;
      timer = setTimeout(() => {
        void runLoadOptions(search);
      }, delay);
    },
    cancel: () => {
      if (timer) clearTimeout(timer);
    },
  };

  /**
   * Executes the loadOptions configuration function.
   * @param {string} search - The search term to pass to the loader.
   */
  async function runLoadOptions(search: string): Promise<void> {
    const config = ctx.getConfig();
    const state = ctx.getState();
    const { loadOptions, cacheOptions } = config;

    if (!loadOptions) return;

    latestSearchQuery = search;
    config.onLoadStart?.();
    ctx.setState({ isLoading: true, error: null });

    try {
      const loader = () => loadOptions(search);
      const results = cacheOptions ? await cache.load(search, loader) : await loader();

      if (search !== latestSearchQuery) return;

      const merged = mergeOptions(state.resolvedOptions, results);
      const visible = computeVisibleOptions(config, merged, search, state.selectedValues);

      ctx.setState({
        isLoading: false,
        resolvedOptions: merged,
        visibleOptions: visible,
        canCreate: computeCanCreate(config, search, merged),
      });

      config.onLoadEnd?.(results);
    } catch (err) {
      if (search !== latestSearchQuery) return;
      const error = err instanceof Error ? err : new Error(String(err));
      ctx.setState({ isLoading: false, error });
      config.onLoadEnd?.([]);
    }
  }

  /**
   * Updates the current search term and triggers filtering or loading.
   * @param {string} term - The new search string.
   */
  function setSearch(term: string): void {
    const config = ctx.getConfig();
    const state = ctx.getState();
    const min = config.minSearchLength ?? 0;
    const resolved = state.resolvedOptions;

    const visible =
      term.length >= min
        ? computeVisibleOptions(config, resolved, term, state.selectedValues)
        : computeVisibleOptions(config, resolved, '', state.selectedValues);

    ctx.setState({
      search: term,
      visibleOptions: visible,
      focusedOptionValue: visible[0]?.value ?? null,
      canCreate: computeCanCreate(config, term, resolved),
    });

    config.onSearch?.(term);

    if (config.loadOptions && term.length >= min) {
      debouncedLoad.call(term);
    }
  }

  return { setSearch, runLoadOptions, debouncedLoad };
}
