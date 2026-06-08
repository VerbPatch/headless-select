import type { ListboxProps } from '../core/types';
import type { SelectContext } from '../core/context';

/**
 * Generates props for the listbox container.
 * @group getters
 * @title getListboxProps
 * @description Provides ARIA attributes and IDs for the scrollable container that holds the options.
 * @param {SelectContext} ctx - The internal select context.
 * @returns {ListboxProps} - Props for the listbox element.
 */
export function getListboxProps(ctx: SelectContext): ListboxProps {
  const config = ctx.getConfig();
  return {
    id: ctx.listboxId,
    role: 'listbox',
    'aria-multiselectable': config.multiple ?? false,
    'aria-label': config.ariaLabel,
  };
}
