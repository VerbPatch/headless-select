import type { SelectOption, SelectChange } from '../core/types.js';
import { mergeOptions, computeVisibleOptions } from '../utils/index.js';
import type { SelectContext } from '../core/context.js';

export function createCreatableActions(ctx: SelectContext) {
  function createOption(input: string): void {
    const config = ctx.getConfig();
    const state = ctx.getState();
    if (!config.creatable || !state.canCreate) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    const result = config.onCreate?.(trimmed);
    const newOption: SelectOption =
      result && typeof result === 'object' ? result : { value: trimmed, label: trimmed };

    const merged = mergeOptions(state.resolvedOptions, [newOption]);
    const change: SelectChange = { type: 'create', option: newOption };
    const multiple = config.multiple ?? false;
    const next = multiple ? [...state.selectedValues, newOption.value] : [newOption.value];
    const closeOnSelect = config.closeOnSelect ?? !multiple;

    ctx.setState(
      {
        resolvedOptions: merged,
        selectedValues: next,
        isOpen: closeOnSelect ? false : state.isOpen,
        search: closeOnSelect ? '' : state.search,
        visibleOptions: computeVisibleOptions(
          config,
          merged,
          closeOnSelect ? '' : state.search,
          next,
        ),
        canCreate: false,
        focusedOptionValue: null,
      },
      change,
    );

    if (closeOnSelect) config.onClose?.();
  }

  return { createOption };
}
