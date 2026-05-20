import { useState, useLayoutEffect, useEffect, useMemo, useRef } from 'react';
import {
  useSelect as headlessSelect,
  SelectConfig,
  SelectState,
  SelectInstance,
} from '@verbpatch/headless-select';

export * from '@verbpatch/headless-select';

const initialState: SelectState = {
  isOpen: false,
  search: '',
  selectedValues: [],
  resolvedOptions: [],
  visibleOptions: [],
  focusedOptionValue: null,
  canCreate: false,
  isLoading: false,
  error: null,
};

export function useSelect(config: SelectConfig) {
  const [state, setState] = useState<SelectState>(initialState);
  const instanceRef = useRef<SelectInstance | null>(null);
  const prevConfigRef = useRef<SelectConfig | null>(null);
  const nativeRef = useRef<HTMLSelectElement>(null);

  // Initialize or re-initialize the instance
  useLayoutEffect(() => {
    if (!config) return;

    if (!instanceRef.current) {
      instanceRef.current = headlessSelect(config);
    }

    // Always subscribe BEFORE potentially triggering changes via setConfig
    const unsubscribe = instanceRef.current.subscribe(setState);
    
    // Ensure React state is in sync with the current instance state
    setState(instanceRef.current.getState());

    // Automatically sync nativeRef to hydrateFrom if not explicitly provided
    const finalConfig = { ...config };
    if (!finalConfig.hydrateFrom && nativeRef.current) {
      finalConfig.hydrateFrom = nativeRef.current;
    }

    instanceRef.current.setConfig(finalConfig);
    prevConfigRef.current = config;
    
    return () => {
      unsubscribe();
    };
  }, [config?.hydrateFrom, !!nativeRef.current]);

  // Handle dynamic config updates (non-element changes)
  useLayoutEffect(() => {
    if (!instanceRef.current || !config || config === prevConfigRef.current) return;

    // Deep-ish check for config changes to avoid infinite loops with object literals
    const prev = prevConfigRef.current;
    if (prev) {
      const keys = Object.keys(config) as Array<keyof SelectConfig>;
      const prevKeys = Object.keys(prev) as Array<keyof SelectConfig>;

      if (keys.length === prevKeys.length) {
        const hasChanged = keys.some((key) => {
          // Skip hydrateFrom as it's handled in the other effect
          if (key === 'hydrateFrom') return false;
          return config[key] !== prev[key];
        });

        if (!hasChanged) return;
      }
    }

    const finalConfig = { ...config };
    if (!finalConfig.hydrateFrom && nativeRef.current) {
      finalConfig.hydrateFrom = nativeRef.current;
    }

    instanceRef.current.setConfig(finalConfig);
    prevConfigRef.current = config;
  }, [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return useMemo(() => {
    const inst = instanceRef.current;

    return {
      state,
      instance: inst,
      nativeRef,
      getTriggerProps: () => (inst ? inst.getTriggerProps() : ({} as any)),
      getListboxProps: () => (inst ? inst.getListboxProps() : ({} as any)),
      getOptionProps: (value: string) => (inst ? inst.getOptionProps(value) : ({} as any)),
      getSearchInputProps: () => (inst ? inst.getSearchInputProps() : ({} as any)),
      getNativeSelectProps: () => (inst ? inst.getNativeSelectProps() : ({} as any)),
      getCreateOptionProps: () => (inst ? inst.getCreateOptionProps() : ({} as any)),
      getClearOptionProps: (value: string) => (inst ? inst.getClearOptionProps(value) : ({} as any)),
    };
  }, [state]);
}
