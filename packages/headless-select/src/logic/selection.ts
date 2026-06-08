import type { SelectChange } from '../core/types';
import { computeVisibleOptions } from '../utils/index';
import type { SelectContext } from '../core/context';

/**
 * Factory for selection-related actions.
 * @group logic
 * @title createSelectionActions
 * @description Provides methods to select, deselect, toggle, and clear options within the select instance.
 * @param {SelectContext} ctx - The internal select context.
 * @returns {SelectionActions} - Object containing selection actions.
 */
export function createSelectionActions(ctx: SelectContext) {
  /**
   * Selects an option by its value.
   * @param {string} value - The unique value of the option to select.
   */
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

  /**
   * Deselects an option by its value.
   * @param {string} value - The unique value of the option to deselect.
   */
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

  /**
   * Toggles the selection state of an option.
   * @param {string} value - The unique value of the option to toggle.
   */
  function toggleOption(value: string): void {
    const state = ctx.getState();
    const config = ctx.getConfig();
    const isSelected = state.selectedValues.includes(value);

    if (isSelected) {
      if (config.multiple) {
        deselectOption(value);
      } else {
        const closeOnSelect = config.closeOnSelect ?? true;
        if (closeOnSelect) {
          ctx.setState({
            isOpen: false,
            search: '',
            focusedOptionValue: null,
          });
          config.onClose?.();
        }
      }
    } else {
      selectOption(value);
    }
  }

  /**
   * Clears all current selections.
   */
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
