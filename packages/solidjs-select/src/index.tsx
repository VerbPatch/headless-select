import { createSignal, createEffect, onCleanup } from 'solid-js';
import {
  useSelect as headlessSelect,
  SelectConfig,
  SelectState,
} from '@verbpatch/headless-select';
export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const instance = headlessSelect(config);
  const [state, setState] = createSignal<SelectState>(instance.getState());

  const unsubscribe = instance.subscribe(setState);
  onCleanup(() => {
    unsubscribe();
    instance.destroy();
  });

  createEffect(() => {
    instance.setConfig(config);
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
