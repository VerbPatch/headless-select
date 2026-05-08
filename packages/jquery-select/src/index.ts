import { useSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';
import $ from 'jquery';

export function initJQuerySelect(element: HTMLElement, config: SelectConfig) {
  const instance = useSelect({
    ...config,
    hydrateFrom: element instanceof HTMLSelectElement ? element : undefined,
  });

  const $el = $(element);

  instance.subscribe((state: SelectState) => {
    $el.trigger('headless-select:change', [state]);
  });

  return {
    instance,
    destroy: () => {
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
