import type { ListboxProps } from '../core/types.js';
import type { SelectContext } from '../core/context.js';

export function getListboxProps(ctx: SelectContext): ListboxProps {
  const config = ctx.getConfig();
  return {
    id: ctx.listboxId,
    role: 'listbox',
    'aria-multiselectable': config.multiple ?? false,
    'aria-label': config.ariaLabel,
  };
}
