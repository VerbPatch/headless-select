import type { SelectContext } from '../core/context.js';
import { nextFocusableIndex } from '../utils/index.js';

export function createFocusActions(ctx: SelectContext) {
  function focusOption(value: string | null): void {
    ctx.setState({ focusedOptionValue: value });
  }

  function focusNext(): void {
    const state = ctx.getState();
    ctx.setState({
      focusedOptionValue: nextFocusableIndex(state.visibleOptions, state.focusedOptionValue, 1),
    });
  }

  function focusPrev(): void {
    const state = ctx.getState();
    ctx.setState({
      focusedOptionValue: nextFocusableIndex(state.visibleOptions, state.focusedOptionValue, -1),
    });
  }

  function focusFirst(): void {
    const state = ctx.getState();
    const first = state.visibleOptions.find((o) => !o.disabled);
    ctx.setState({ focusedOptionValue: first?.value ?? null });
  }

  function focusLast(): void {
    const state = ctx.getState();
    const enabled = state.visibleOptions.filter((o) => !o.disabled);
    const last = enabled[enabled.length - 1];
    ctx.setState({ focusedOptionValue: last?.value ?? null });
  }

  return { focusOption, focusNext, focusPrev, focusFirst, focusLast };
}
