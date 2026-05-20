import { getOptionId } from '@/utils/index';
import type { SearchInputProps } from '@/core/types';
import type { SelectContext, SelectActions, KeyboardActions } from '@/core/context';

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
