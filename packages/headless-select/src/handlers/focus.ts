import type { SelectContext } from '../core/context';
import { nextFocusableIndex } from '../utils/index';

/**
 * Factory for focus-related actions.
 * @group handlers
 * @title createFocusActions
 * @description Provides logic for moving keyboard focus between options in the dropdown list.
 * @param {SelectContext} ctx - The internal select context.
 * @returns {FocusActions} - Object containing focus actions.
 */
export function createFocusActions(ctx: SelectContext) {
  /**
   * Manually focuses an option by its value.
   * @param {string | null} value - The value of the option to focus, or null to clear focus.
   */
  function focusOption(value: string | null): void {
    ctx.setState({ focusedOptionValue: value });
  }

  /**
   * Moves focus to the next available option.
   */
  function focusNext(): void {
    const state = ctx.getState();
    ctx.setState({
      focusedOptionValue: nextFocusableIndex(state.visibleOptions, state.focusedOptionValue, 1),
    });
  }

  /**
   * Moves focus to the previous available option.
   */
  function focusPrev(): void {
    const state = ctx.getState();
    ctx.setState({
      focusedOptionValue: nextFocusableIndex(state.visibleOptions, state.focusedOptionValue, -1),
    });
  }

  /**
   * Moves focus to the first visible and enabled option.
   */
  function focusFirst(): void {
    const state = ctx.getState();
    const first = state.visibleOptions.find((o) => !o.disabled);
    ctx.setState({ focusedOptionValue: first?.value ?? null });
  }

  /**
   * Moves focus to the last visible and enabled option.
   */
  function focusLast(): void {
    const state = ctx.getState();
    const enabled = state.visibleOptions.filter((o) => !o.disabled);
    const last = enabled[enabled.length - 1];
    ctx.setState({ focusedOptionValue: last?.value ?? null });
  }

  return { focusOption, focusNext, focusPrev, focusFirst, focusLast };
}
