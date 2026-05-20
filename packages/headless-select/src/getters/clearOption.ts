import type { SelectActions } from '@/core/context';

export function getClearOptionProps(actions: SelectActions, value: string) {
  return {
    onClick: (e: any) => {
      e.stopPropagation();
      actions.deselectOption(value);
    },
    role: 'button',
    'aria-label': `Deselect ${value}`,
  };
}
