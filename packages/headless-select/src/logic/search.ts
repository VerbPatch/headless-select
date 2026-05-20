import { computeVisibleOptions, computeCanCreate, debounce, mergeOptions } from '@/utils/index';
import type { SelectContext } from '@/core/context';
import type { OptionsCache } from '@/core/cache';

export function createSearchActions(ctx: SelectContext, cache: OptionsCache) {
  const debouncedLoad = debounce((search: string) => {
    void runLoadOptions(search);
  }, ctx.getConfig().searchDelay ?? 300);

  async function runLoadOptions(search: string): Promise<void> {
    const config = ctx.getConfig();
    const state = ctx.getState();
    const { loadOptions, cacheOptions } = config;

    if (!loadOptions) return;

    config.onLoadStart?.();
    ctx.setState({ isLoading: true, error: null });

    try {
      const loader = () => loadOptions(search);
      const results = cacheOptions ? await cache.load(search, loader) : await loader();

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
      const error = err instanceof Error ? err : new Error(String(err));
      ctx.setState({ isLoading: false, error });
      config.onLoadEnd?.([]);
    }
  }

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
