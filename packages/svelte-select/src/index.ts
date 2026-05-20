import { readable } from 'svelte/store';
import { onDestroy } from 'svelte';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';

export * from '@verbpatch/headless-select';

export function useSelect(initialConfig: SelectConfig) {
  const instance = headlessSelect(initialConfig);

  const state = readable<SelectState>(instance.getState(), (set) => {
    return instance.subscribe(set);
  });

  onDestroy(() => {
    instance.destroy();
  });

  return {
    state,
    instance,
    getTriggerProps: () => instance.getTriggerProps(),
    getListboxProps: () => instance.getListboxProps(),
    getOptionProps: (value: string) => instance.getOptionProps(value),
    getSearchInputProps: () => instance.getSearchInputProps(),
  };
}
