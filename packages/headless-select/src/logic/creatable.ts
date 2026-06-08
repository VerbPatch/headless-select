import type { SelectOption, SelectChange } from '../core/types';
import { mergeOptions, computeVisibleOptions } from '../utils/index';
import type { SelectContext } from '../core/context';

/**
 * Factory for creatable-related actions.
 * @group logic
 * @title createCreatableActions
 * @description Provides the logic for dynamically creating and selecting new options from user input.
 * @param {SelectContext} ctx - The internal select context.
 * @returns {CreatableActions} - Object containing the createOption action.
 */
export function createCreatableActions(ctx: SelectContext) {
  /**
   * Creates a new option and selects it.
   * @param {string} input - The text input used to create the new option.
   */
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
