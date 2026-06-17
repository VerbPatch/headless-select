import { KeyboardActions, SelectActions, SelectContext } from '../core/context';
import { getClearOptionProps } from './clearOption';
import { getCreateOptionProps } from './createOption';
import { getListboxProps } from './listbox';
import { getNativeSelectProps } from './nativeSelect';
import { getOptionProps } from './option';
import { getSearchInputProps } from './searchInput';
import { getTriggerProps } from './trigger';

/**
 * Factory for all prop getter functions.
 * @ignore
 * @title createGetters
 * @description Bundles all individual prop getters into a single object for use by the select instance.
 * @param {SelectContext} ctx - The internal select context.
 * @param {SelectActions} actions - Core instance actions.
 * @param {KeyboardActions} keyboard - Keyboard interaction handlers.
 * @returns {Object} - Object containing all prop getter functions.
 */
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
    getNativeSelectProps: () => getNativeSelectProps(ctx),
    getCreateOptionProps: () => getCreateOptionProps(ctx, actions),
    getClearOptionProps: (value: string) => getClearOptionProps(actions, value),
  };
}
