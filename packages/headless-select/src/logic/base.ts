import { computeVisibleOptions, mergeOptions } from '../utils/index.js';
import type { SelectContext } from '../core/context.js';

export function createBaseActions(
  ctx: SelectContext,
  runLoadOptions: (search: string) => Promise<void>,
) {
  async function maybeLoadDefaultOptions(): Promise<void> {
    const config = ctx.getConfig();
    const state = ctx.getState();
    const { defaultOptions, loadOptions } = config;

    if (!loadOptions) return;

    if (defaultOptions === true) {
      await runLoadOptions('');
    } else if (Array.isArray(defaultOptions)) {
      const merged = mergeOptions(state.resolvedOptions, defaultOptions);
      ctx.setState({
        resolvedOptions: merged,
        visibleOptions: computeVisibleOptions(config, merged, state.search, state.selectedValues),
      });
    }
  }

  function open(): void {
    const config = ctx.getConfig();
    const state = ctx.getState();
    if (config.disabled || state.isOpen) return;

    ctx.setState({ isOpen: true });
    config.onOpen?.();
    void maybeLoadDefaultOptions();
  }

  function close(): void {
    const state = ctx.getState();
    const config = ctx.getConfig();
    if (!state.isOpen) return;

    ctx.setState({
      isOpen: false,
      search: '',
      focusedOptionValue: null,
      visibleOptions: computeVisibleOptions(
        config,
        state.resolvedOptions,
        '',
        state.selectedValues,
      ),
    });
    config.onClose?.();
  }

  function toggle(): void {
    ctx.getState().isOpen ? close() : open();
  }

  return { open, close, toggle };
}
