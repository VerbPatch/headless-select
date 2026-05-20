import type { TriggerProps } from '@/core/types';
import type { SelectContext, SelectActions, KeyboardActions } from '@/core/context';

export function getTriggerProps(
  ctx: SelectContext,
  actions: SelectActions,
  keyboard: KeyboardActions,
): TriggerProps {
  const state = ctx.getState();
  const config = ctx.getConfig();

  return {
    role: 'combobox',
    'aria-expanded': state.isOpen,
    'aria-haspopup': 'listbox',
    'aria-controls': ctx.listboxId,
    'aria-label': config.ariaLabel,
    'aria-labelledby': config.ariaLabelledBy,
    'aria-disabled': config.disabled ?? false,
    tabIndex: config.disabled ? -1 : 0,
    onClick: actions.toggle,
    onKeyDown: keyboard.handleKeyDown,
  };
}
