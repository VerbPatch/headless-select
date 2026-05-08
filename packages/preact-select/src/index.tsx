import { useState, useEffect, useMemo, useCallback } from 'preact/hooks';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';
export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const instance = useMemo(() => headlessSelect(config), []);
  const [state, setState] = useState<SelectState>(instance.getState());

  useEffect(() => {
    const unsubscribe = instance.subscribe(setState);
    return () => {
      unsubscribe();
      instance.destroy();
    };
  }, [instance]);

  useEffect(() => {
    instance.setConfig(config);
  }, [config, instance]);

  return {
    state,
    instance,
    getTriggerProps: useCallback(() => instance.getTriggerProps(), [instance]),
    getListboxProps: useCallback(() => instance.getListboxProps(), [instance]),
    getOptionProps: useCallback((value: string) => instance.getOptionProps(value), [instance]),
    getSearchInputProps: useCallback(() => instance.getSearchInputProps(), [instance]),
  };
}
