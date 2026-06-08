import type { SelectActions } from '../core/context';

/**
 * Generates props for a button that clears a specific selected option.
 * @group getters
 * @title getClearOptionProps
 * @description Typically used in multi-select "tags" to allow deselecting a single item.
 * @param {SelectActions} actions - Core instance actions.
 * @param {string} value - The value of the option to be cleared.
 * @returns {Object} - Props for the clear button.
 */
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
