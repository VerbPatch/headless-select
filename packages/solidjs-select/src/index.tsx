import { createSignal, createEffect, onCleanup } from 'solid-js';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';
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
    const keys: Array<keyof SelectConfig> = [
      'value', 'defaultValue', 'options', 'loadOptions', 'defaultOptions',
      'cacheOptions', 'hydrateFrom', 'multiple', 'searchable', 'clearable',
      'disabled', 'creatable', 'closeOnSelect', 'filterOption', 'searchDelay',
      'minSearchLength', 'placeholder', 'loadingMessage', 'noOptionsMessage',
      'isValidNewOption', 'onCreate', 'createOptionLabel', 'virtualize',
      'itemHeight', 'containerHeight', 'inputId', 'ariaLabel', 'ariaLabelledBy',
      'onChange', 'onOpen', 'onClose', 'onSearch', 'onLoadStart', 'onLoadEnd'
    ];
    const resolvedConfig = {} as SelectConfig;
    for (const key of keys) {
      if (config[key] !== undefined) {
        resolvedConfig[key] = config[key] as any;
      }
    }
    instance.setConfig(resolvedConfig);
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
