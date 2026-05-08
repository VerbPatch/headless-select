import { useState, useEffect, useMemo, useRef } from 'react';
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
  useEffect(() => {
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
      // We don't necessarily destroy here if it's just a config update, 
      // but if the hook unmounts we should. 
      // Handled by the next effect.
    };
  }, [config?.hydrateFrom]);

  // Handle dynamic config updates (non-element changes)
  useEffect(() => {
    if (instanceRef.current) {
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
