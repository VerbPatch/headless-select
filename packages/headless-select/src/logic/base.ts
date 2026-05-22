import { computeVisibleOptions, mergeOptions } from '@/utils/index';
import type { SelectContext } from '@/core/context';

/**
 * Factory for base lifecycle actions.
 * @group logic
 * @title createBaseActions
 * @description Provides core visibility actions like opening, closing, and toggling the dropdown menu.
 * @param {SelectContext} ctx - The internal select context.
 * @param {Function} runLoadOptions - Function to trigger asynchronous loading.
 * @returns {BaseActions} - Object containing base actions.
 */
export function createBaseActions(
  ctx: SelectContext,
  runLoadOptions: (search: string) => Promise<void>,
) {
  /**
   * Loads default options if configured.
   */
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

  /**
   * Opens the dropdown menu.
   */
  function open(): void {
    const config = ctx.getConfig();
    const state = ctx.getState();
    if (config.disabled || state.isOpen) return;

    let focusVal = state.focusedOptionValue;
    if (!focusVal && state.selectedValues.length > 0) {
      // Find the first selected value that is currently visible
      const firstVisibleSelected = state.visibleOptions.find((o) =>
        state.selectedValues.includes(o.value),
      );
      if (firstVisibleSelected) {
        focusVal = firstVisibleSelected.value;
      } else {
        focusVal = state.selectedValues[0];
      }
    }

    ctx.setState({ isOpen: true, focusedOptionValue: focusVal });
    config.onOpen?.();
    void maybeLoadDefaultOptions();
  }

  /**
   * Closes the dropdown menu.
   */
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

  /**
   * Toggles the dropdown menu open or closed.
   */
  function toggle(): void {
    ctx.getState().isOpen ? close() : open();
  }

  return { open, close, toggle };
}
