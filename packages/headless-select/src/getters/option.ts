import { getOptionId } from '@/utils/index';
import type { OptionProps } from '@/core/types';
import type { SelectContext, SelectActions, KeyboardActions } from '@/core/context';

export function getOptionProps(
  ctx: SelectContext,
  actions: SelectActions,
  keyboard: KeyboardActions,
  value: string,
): OptionProps {
  const state = ctx.getState();
  const option = state.resolvedOptions.find((o) => o.value === value);
  const isSelected = state.selectedValues.includes(value);
  const isDisabled = option?.disabled ?? false;
  const isFocused = state.focusedOptionValue === value;

  const optionId = getOptionId(ctx.instanceId, value);

  return {
    id: optionId,
    role: 'option',
    'aria-selected': isSelected,
    'aria-disabled': isDisabled,
    'data-focused': isFocused,
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      if (isDisabled) return;
      actions.toggleOption(value);
    },
    onMouseEnter: () => {
      if (!isDisabled) keyboard.focusOption(value);
    },
  };
}
