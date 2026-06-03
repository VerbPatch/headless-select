import { createSignal, createEffect, onCleanup } from 'solid-js';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';
export * from '@verbpatch/headless-select';

export function useSelect(configInput: SelectConfig | (() => SelectConfig)) {
  const getConfig = () => (typeof configInput === 'function' ? configInput() : configInput);
  const instance = headlessSelect(getConfig());
  const [state, setState] = createSignal<SelectState>(instance.getState());

  const unsubscribe = instance.subscribe(setState);
  onCleanup(() => {
    unsubscribe();
    instance.destroy();
  });

  let nativeElement: HTMLSelectElement | null = null;

  createEffect(() => {
    const currentConfig = getConfig();
    const resolvedConfig = {} as SelectConfig;
    const keys = Object.keys(currentConfig) as Array<keyof SelectConfig>;
    for (const key of keys) {
      resolvedConfig[key] = currentConfig[key] as any;
    }
    if (!resolvedConfig.hydrateFrom && nativeElement) {
      resolvedConfig.hydrateFrom = nativeElement;
    }
    instance.setConfig(resolvedConfig);
  });

  const nativeRef = (el: HTMLSelectElement) => {
    nativeElement = el;
    const currentConfig = getConfig();
    if (!currentConfig.hydrateFrom) {
      instance.setConfig({ hydrateFrom: el });
    }
  };

  return {
    state,
    instance,
    nativeRef,
    getTriggerProps: () => {
      state(); // register reactivity
      return instance.getTriggerProps();
    },
    getListboxProps: () => {
      state(); // register reactivity
      return instance.getListboxProps();
    },
    getOptionProps: (value: string) => {
      state(); // register reactivity
      return instance.getOptionProps(value);
    },
    getSearchInputProps: () => {
      state(); // register reactivity
      return instance.getSearchInputProps();
    },
    getNativeSelectProps: () => {
      state(); // register reactivity
      return instance.getNativeSelectProps();
    },
    getCreateOptionProps: () => {
      state(); // register reactivity
      return instance.getCreateOptionProps();
    },
    getClearOptionProps: (value: string) => {
      state(); // register reactivity
      return instance.getClearOptionProps(value);
    },
    getOptionLabel: (value: string) => {
      return state().resolvedOptions.find((o) => o.value === value)?.label ?? value;
    },
    getSelectedOptions: () => {
      return state().resolvedOptions.filter((o) => state().selectedValues.includes(o.value));
    },
    setConfig: (patch: Partial<SelectConfig>) => instance.setConfig(patch),
  };
}
