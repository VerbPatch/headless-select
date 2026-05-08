import { useStore, useTask$, $ } from '@builder.io/qwik';
import {
  useSelect as headlessSelect,
  type SelectConfig,
  type SelectState,
} from '@verbpatch/headless-select';
export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const store = useStore({
    state: {} as SelectState,
    stateVersion: 0,
  });

  const instance = headlessSelect({
    ...config,
    onOpen: $(() => {
      store.stateVersion++;
      config.onOpen?.();
    }),
    onClose: $(() => {
      store.stateVersion++;
      config.onClose?.();
    }),
    onChange: $((values, change) => {
      store.stateVersion++;
      config.onChange?.(values, change);
    }),
    onSearch: $((search) => {
      store.stateVersion++;
      config.onSearch?.(search);
    }),
  });

  useTask$(({ track }) => {
    track(() => store.stateVersion);
    store.state = instance.getState();
  });

  return {
    store,
    instance,
    getTriggerProps: $(() => instance.getTriggerProps()),
    getListboxProps: $(() => instance.getListboxProps()),
    getOptionProps: $((value: string) => instance.getOptionProps(value)),
    getSearchInputProps: $(() => instance.getSearchInputProps()),
  };
}
