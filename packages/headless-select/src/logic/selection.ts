import type { SelectChange } from '../core/types.js';
import { computeVisibleOptions } from '../utils/index.js';
import type { SelectContext } from '../core/context.js';

export function createSelectionActions(ctx: SelectContext) {
  function selectOption(value: string): void {
    const config = ctx.getConfig();
    const state = ctx.getState();
    if (config.disabled) return;

    const option = state.resolvedOptions.find((o) => o.value === value);
    if (!option || option.disabled) return;

    const multiple = config.multiple ?? false;
    let next: string[];

    if (multiple) {
      if (state.selectedValues.includes(value)) return;
      next = [...state.selectedValues, value];
    } else {
      next = [value];
    }

    const change: SelectChange = { type: 'select', option };
    const closeOnSelect = config.closeOnSelect ?? !multiple;

    const visible = computeVisibleOptions(
      config,
      state.resolvedOptions,
      closeOnSelect ? '' : state.search,
      next,
    );

    ctx.setState(
      {
        selectedValues: next,
        isOpen: closeOnSelect ? false : state.isOpen,
        search: closeOnSelect ? '' : state.search,
        visibleOptions: visible,
        focusedOptionValue: closeOnSelect ? null : state.focusedOptionValue,
      },
      change,
    );

    if (closeOnSelect) config.onClose?.();
  }

  function deselectOption(value: string): void {
    const config = ctx.getConfig();
    const state = ctx.getState();
    if (config.disabled) return;

    const option = state.resolvedOptions.find((o) => o.value === value);
    const next = state.selectedValues.filter((v) => v !== value);
    const change: SelectChange = { type: 'deselect', option: option ?? null };

    ctx.setState(
      {
        selectedValues: next,
        visibleOptions: computeVisibleOptions(config, state.resolvedOptions, state.search, next),
      },
      change,
    );
  }

  function toggleOption(value: string): void {
    ctx.getState().selectedValues.includes(value) ? deselectOption(value) : selectOption(value);
  }

  function clearAll(): void {
    const config = ctx.getConfig();
    if (config.disabled) return;

    const change: SelectChange = { type: 'clear', option: null };

    ctx.setState(
      {
        selectedValues: [],
        visibleOptions: computeVisibleOptions(
          config,
          ctx.getState().resolvedOptions,
          ctx.getState().search,
          [],
        ),
      },
      change,
    );
  }

  return { selectOption, deselectOption, toggleOption, clearAll };
}
