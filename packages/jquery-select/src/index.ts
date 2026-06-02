import { useSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';
import $ from 'jquery';

export function initJQuerySelect(element: HTMLElement, config: SelectConfig) {
  const instance = useSelect({
    ...config,
    hydrateFrom: element instanceof HTMLSelectElement ? element : undefined,
  });

  const $el = $(element);

  const unsubscribe = instance.subscribe((state: SelectState) => {
    $el.trigger('headless-select:change', [state]);
  });

  return {
    instance,
    getTriggerProps: () => instance.getTriggerProps(),
    getListboxProps: () => instance.getListboxProps(),
    getOptionProps: (value: string) => instance.getOptionProps(value),
    getSearchInputProps: () => instance.getSearchInputProps(),
    getNativeSelectProps: () => instance.getNativeSelectProps(),
    getCreateOptionProps: () => instance.getCreateOptionProps(),
    getClearOptionProps: (value: string) => instance.getClearOptionProps(value),
    destroy: () => {
      unsubscribe();
      instance.destroy();
    },
  };
}

if (typeof window !== 'undefined' && (window as any).jQuery) {
  (window as any).jQuery.fn.headlessSelect = function (this: any, config: SelectConfig) {
    return this.each(function (this: any) {
      const data = initJQuerySelect(this, config);
      $(this).data('headless-select', data);
    });
  };
}
