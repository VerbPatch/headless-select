import { getOptionId } from '@/utils/index';
import type { SearchInputProps } from '@/core/types';
import type { SelectContext, SelectActions, KeyboardActions } from '@/core/context';

/**
 * Returns the props for the search input element.
 * @group getters
 * @title getSearchInputProps
 * @description Returns the props for the search input element, including accessibility attributes and event handlers.
 * @param {SelectContext} ctx - The select context.
 * @param {SelectActions} actions - The select actions.
 * @param {KeyboardActions} keyboard - The keyboard actions.
 * @returns {SearchInputProps} - The props for the search input element.
 */
export function getSearchInputProps(
  ctx: SelectContext,
  actions: SelectActions,
  keyboard: KeyboardActions,
): SearchInputProps {
  const state = ctx.getState();
  const config = ctx.getConfig();
  const focusedId = state.focusedOptionValue
    ? getOptionId(ctx.instanceId, state.focusedOptionValue)
    : undefined;

  return {
    id: config.inputId,
    type: 'text',
    role: 'searchbox',
    autoComplete: 'off',
    'aria-autocomplete': 'list',
    'aria-controls': ctx.listboxId,
    'aria-activedescendant': focusedId,
    value: state.search,
    onInput: (e: InputEvent) => {
      actions.setSearch((e.target as HTMLInputElement).value);
    },
    onKeyDown: keyboard.handleKeyDown,
  };
}
