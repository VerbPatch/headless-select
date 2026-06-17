import { useState, useLayoutEffect, useMemo, useRef } from 'react';
import {
  useSelect as headlessSelect,
  SelectConfig,
  SelectState,
  SelectInstance,
} from '@verbpatch/headless-select';

export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const instanceRef = useRef<SelectInstance | null>(null);
  if (!instanceRef.current) {
    instanceRef.current = headlessSelect(config);
  }

  const [state, setState] = useState<SelectState>(() => instanceRef.current!.getState());
  const nativeRef = useRef<HTMLSelectElement>(null);

  useLayoutEffect(() => {
    let currentInstance = instanceRef.current;

    if (!currentInstance) {
      currentInstance = headlessSelect(config);
      instanceRef.current = currentInstance;
      setState(currentInstance.getState());
    }

    const unsubscribe = currentInstance.subscribe(setState);

    return () => {
      unsubscribe();
      currentInstance!.destroy();
      instanceRef.current = null;
    };
  }, []);

  const prevConfigRef = useRef<SelectConfig | null>(null);
  const prevNativeRef = useRef<HTMLSelectElement | null>(null);
  const prevInstanceRef = useRef<SelectInstance | null>(null);

  useLayoutEffect(() => {
    if (!instanceRef.current) return;

    let shouldUpdate = false;

    if (instanceRef.current !== prevInstanceRef.current) {
      shouldUpdate = true;
    } else if (config !== prevConfigRef.current) {
      const prev = prevConfigRef.current;
      if (!prev) {
        shouldUpdate = true;
      } else {
        const keys = Object.keys(config) as Array<keyof SelectConfig>;
        const prevKeys = Object.keys(prev) as Array<keyof SelectConfig>;

        if (keys.length !== prevKeys.length) {
          shouldUpdate = true;
        } else {
          shouldUpdate = keys.some((key) => {
            if (key === 'hydrateFrom') return false;
            return config[key] !== prev[key];
          });
        }
      }
    }

    if (!config.hydrateFrom && nativeRef.current !== prevNativeRef.current) {
      shouldUpdate = true;
    }

    if (!shouldUpdate) return;

    const finalConfig = { ...config };
    if (!finalConfig.hydrateFrom && nativeRef.current) {
      finalConfig.hydrateFrom = nativeRef.current;
    }

    instanceRef.current.setConfig(finalConfig);
    prevConfigRef.current = config;
    prevNativeRef.current = nativeRef.current;
    prevInstanceRef.current = instanceRef.current;
  });

  return useMemo(() => {
    const inst = instanceRef.current!;

    return {
      state,
      instance: inst,
      nativeRef,
      getTriggerProps: () => inst.getTriggerProps(),
      getListboxProps: () => inst.getListboxProps(),
      getOptionProps: (value: string) => inst.getOptionProps(value),
      getSearchInputProps: () => inst.getSearchInputProps(),
      getNativeSelectProps: () => inst.getNativeSelectProps(),
      getCreateOptionProps: () => inst.getCreateOptionProps(),
      getClearOptionProps: (value: string) => inst.getClearOptionProps(value),
    };
  }, [state]);
}
