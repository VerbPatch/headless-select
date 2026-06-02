import { readable } from 'svelte/store';
import { onDestroy } from 'svelte';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';

export * from '@verbpatch/headless-select';

export function useSelect(initialConfig: SelectConfig) {
  let currentConfig: SelectConfig | undefined;
  let unsubscribeConfig: (() => void) | undefined;
  const instanceRef: { current: any } = { current: null };

  const isStore = initialConfig && typeof (initialConfig as any).subscribe === 'function';

  if (isStore) {
    unsubscribeConfig = (initialConfig as any).subscribe((val: SelectConfig) => {
      currentConfig = val;
      if (instanceRef.current) {
        instanceRef.current.setConfig(val);
      }
    });
  } else {
    currentConfig = initialConfig;
  }

  const instance = headlessSelect(currentConfig!);
  instanceRef.current = instance;

  const state = readable<SelectState>(instance.getState(), (set) => {
    return instance.subscribe(set);
  });

  onDestroy(() => {
    if (unsubscribeConfig) {
      unsubscribeConfig();
    }
    instance.destroy();
  });

  return {
    state,
    instance,
    getTriggerProps: () => instance.getTriggerProps(),
    getListboxProps: () => instance.getListboxProps(),
    getOptionProps: (value: string) => instance.getOptionProps(value),
    getSearchInputProps: () => instance.getSearchInputProps(),
    getNativeSelectProps: () => instance.getNativeSelectProps(),
    getCreateOptionProps: () => instance.getCreateOptionProps(),
    getClearOptionProps: (value: string) => instance.getClearOptionProps(value),
    setConfig: (patch: Partial<SelectConfig>) => instance.setConfig(patch),
  };
}
