import { getTriggerProps } from '@/getters/trigger';
import { getListboxProps } from '@/getters/listbox';
import { getOptionProps } from '@/getters/option';
import { getSearchInputProps } from '@/getters/searchInput';
import { getNativeSelectProps } from '@/getters/nativeSelect';
import { getCreateOptionProps } from '@/getters/createOption';
import { getClearOptionProps } from '@/getters/clearOption';
import type { SelectContext, SelectActions, KeyboardActions } from '@/core/context';

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
