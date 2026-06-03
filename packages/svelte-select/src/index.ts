import { readable } from 'svelte/store';
import { onDestroy } from 'svelte';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';

export * from '@verbpatch/headless-select';

function stripEvents(props: any) {
  if (!props) return props;
  const clean: any = {};
  for (const [key, val] of Object.entries(props)) {
    if (!key.startsWith('on')) {
      clean[key] = val;
    }
  }
  return clean;
}

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

  const nativeRef = (node: HTMLSelectElement) => {
    const current = instance.getConfig();
    if (!current.hydrateFrom) {
      instance.setConfig({ hydrateFrom: node });
    }
  };

  return {
    state,
    instance,
    nativeRef,
    getTriggerProps: (_state?: any) => stripEvents(instance.getTriggerProps()),
    getListboxProps: (_state?: any) => stripEvents(instance.getListboxProps()),
    getOptionProps: (value: string, _state?: any) => stripEvents(instance.getOptionProps(value)),
    getSearchInputProps: (_state?: any) => stripEvents(instance.getSearchInputProps()),
    getNativeSelectProps: (_state?: any) => stripEvents(instance.getNativeSelectProps()),
    getCreateOptionProps: (_state?: any) => stripEvents(instance.getCreateOptionProps()),
    getClearOptionProps: (value: string, _state?: any) =>
      stripEvents(instance.getClearOptionProps(value)),

    getTriggerCallbacks: () => instance.getTriggerProps(),
    getListboxCallbacks: () => instance.getListboxProps(),
    getOptionCallbacks: (value: string) => instance.getOptionProps(value),
    getSearchInputCallbacks: () => instance.getSearchInputProps(),
    getCreateOptionCallbacks: () => instance.getCreateOptionProps(),
    getClearOptionCallbacks: (value: string) => instance.getClearOptionProps(value),

    getOptionLabel: (value: string, _state?: any) => instance.getOptionLabel(value),
    getSelectedOptions: (_state?: any) => instance.getSelectedOptions(),
    setConfig: (patch: Partial<SelectConfig>) => instance.setConfig(patch),
  };
}
