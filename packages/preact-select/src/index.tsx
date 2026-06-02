import { useState, useEffect, useMemo, useCallback, useRef } from 'preact/hooks';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';
export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const instance = useMemo(() => headlessSelect(config), []);
  const [state, setState] = useState<SelectState>(instance.getState());
  const prevConfigRef = useRef<SelectConfig | null>(null);

  useEffect(() => {
    const unsubscribe = instance.subscribe(setState);
    return () => {
      unsubscribe();
      instance.destroy();
    };
  }, [instance]);

  useEffect(() => {
    const prev = prevConfigRef.current;
    let shouldUpdate: boolean;
    if (!prev) {
      shouldUpdate = true;
    } else {
      const keys = Object.keys(config) as Array<keyof SelectConfig>;
      const prevKeys = Object.keys(prev) as Array<keyof SelectConfig>;
      if (keys.length !== prevKeys.length) {
        shouldUpdate = true;
      } else {
        shouldUpdate = keys.some((key) => config[key] !== prev[key]);
      }
    }

    if (shouldUpdate) {
      instance.setConfig(config);
      prevConfigRef.current = config;
    }
  }, [config, instance]);

  return {
    state,
    instance,
    getTriggerProps: useCallback(() => instance.getTriggerProps(), [instance]),
    getListboxProps: useCallback(() => instance.getListboxProps(), [instance]),
    getOptionProps: useCallback((value: string) => instance.getOptionProps(value), [instance]),
    getSearchInputProps: useCallback(() => instance.getSearchInputProps(), [instance]),
    getNativeSelectProps: useCallback(() => instance.getNativeSelectProps(), [instance]),
    getCreateOptionProps: useCallback(() => instance.getCreateOptionProps(), [instance]),
    getClearOptionProps: useCallback((value: string) => instance.getClearOptionProps(value), [instance]),
    setConfig: useCallback((patch: Partial<SelectConfig>) => instance.setConfig(patch), [instance]),
  };
}
