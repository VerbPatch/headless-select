import { getTriggerProps } from './trigger.js';
import { getListboxProps } from './listbox.js';
import { getOptionProps } from './option.js';
import { getSearchInputProps } from './searchInput.js';
import type { SelectContext, SelectActions, KeyboardActions } from '../core/context.js';

export function createGetters(
  ctx: SelectContext,
  actions: SelectActions,
  keyboard: KeyboardActions,
) {
  return {
    getTriggerProps: () => getTriggerProps(ctx, actions, keyboard),
    getListboxProps: () => getListboxProps(ctx),
    getOptionProps: (value: string) => getOptionProps(ctx, actions, keyboard, value),
    getSearchInputProps: () => getSearchInputProps(ctx, actions, keyboard),
  };
}
