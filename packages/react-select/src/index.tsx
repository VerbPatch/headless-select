import { useState, useLayoutEffect, useEffect, useMemo, useRef } from 'react';
import {
  useSelect as headlessSelect,
  SelectConfig,
  SelectState,
  SelectInstance
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

  // Initialize or re-initialize the instance when hydrateFrom is available
  // We use useLayoutEffect to ensure the instance is ready before the browser paints
  useLayoutEffect(() => {
    if (!config || !config.hydrateFrom) return;

    if (!instanceRef.current) {
      instanceRef.current = headlessSelect(config);
      setState(instanceRef.current.getState());
    } else {
      instanceRef.current.setConfig(config);
    }

    const unsubscribe = instanceRef.current.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, [config?.hydrateFrom]);

  // Handle dynamic config updates (non-element changes)
  useLayoutEffect(() => {
    if (instanceRef.current && config) {
      instanceRef.current.setConfig(config);
    }
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
      getTriggerProps: () => inst ? inst.getTriggerProps() : ({} as any),
      getListboxProps: () => inst ? inst.getListboxProps() : ({} as any),
      getOptionProps: (value: string) => inst ? inst.getOptionProps(value) : ({} as any),
      getSearchInputProps: () => inst ? inst.getSearchInputProps() : ({} as any),
    };
  }, [state]);
}
