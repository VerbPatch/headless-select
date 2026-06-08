import type {
  SelectChange,
  SelectConfig,
  SelectInstance,
  SelectState,
  Unsubscribe,
  SelectOption,
} from './core/types';
import {
  computeVisibleOptions,
  debounce,
  flattenOptions,
  getOptionId,
  hydrateFromElement,
  mergeOptions,
  scrollIntoView,
  uid,
} from './utils/index';
import { calculateVirtualization } from './features/virtualization';
import { OptionsCache } from './core/cache';
import { SelectContext } from './core/context';
import { createActions } from './logic/index';
import { createHandlers } from './handlers/index';
import { createGetters } from './getters/index';

/**
 * Creates and manages a headless select instance.
 * @group hooks
 * @title useSelect
 * @description The core engine of the library. It manages internal state, provides imperative actions, and generates ARIA-compliant props for UI elements.
 * @param {SelectConfig} initialConfig - The initial configuration for the select instance.
 * @returns {SelectInstance} - An object containing state accessors, actions, and prop getters.
 * @example
 * ```typescript
 * const select = useSelect({
 *   options: [{ value: '1', label: 'Option 1' }],
 *   onChange: (value) => console.log(value),
 * });
 *
 * const triggerProps = select.getTriggerProps();
 * ```
 */
export function useSelect(initialConfig: SelectConfig): SelectInstance {
  const instanceId = uid('hselect');
  const listboxId = `${instanceId}-listbox`;

  let config: SelectConfig = { ...initialConfig };
  const cache = new OptionsCache();

  let hydratedOptions: SelectOption[] = [];
  let hydratedSelectedValues: string[] = [];

  const el = config.hydrateFrom;
  if (el) {
    const h = hydrateFromElement(el);
    hydratedOptions = flattenOptions(h.options);
    hydratedSelectedValues = h.selectedValues;
    if (config.multiple === undefined) {
      config = { ...config, multiple: h.multiple };
    }
  }

  const staticOptions = flattenOptions(config.options ?? []);
  const allInitialOptions = mergeOptions(hydratedOptions, staticOptions);

  function resolveInitialSelected(): string[] {
    const raw = config.value ?? config.defaultValue ?? hydratedSelectedValues;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.length > 0) return [raw];
    return [];
  }

  let state: SelectState = {
    isOpen: false,
    search: '',
    selectedValues: resolveInitialSelected(),
    resolvedOptions: allInitialOptions,
    visibleOptions: computeVisibleOptions(config, allInitialOptions, '', resolveInitialSelected()),
    focusedOptionValue: null,
    canCreate: false,
    isLoading: false,
    error: null,
    scrollTop: 0,
  };

  const listeners = new Set<(s: SelectState) => void>();
  let isInternalSync = false;
  let lastScrollTop = 0;
  let scrollRaf: number | null = null;

  function emit(): void {
    for (const fn of listeners) fn(state);
  }

  function setState(patch: Partial<SelectState>, change?: SelectChange, forceSync = false): void {
    const nextState = { ...state, ...patch };

    if (config.value !== undefined) {
      nextState.selectedValues = Array.isArray(config.value) ? config.value : [config.value];
    }

    let currentScrollTop =
      nextState.scrollTop !== undefined ? nextState.scrollTop : state.scrollTop;

    if (!nextState.isOpen) {
      currentScrollTop = 0;
    } else {
      const isOpening = patch.isOpen === true && !state.isOpen;
      const isFocusChanging =
        patch.focusedOptionValue !== undefined &&
        patch.focusedOptionValue !== state.focusedOptionValue;
      const visibleOptionsChanged = patch.visibleOptions !== undefined;

      if (isOpening || isFocusChanging || visibleOptionsChanged) {
        const focusedValue = nextState.focusedOptionValue;
        if (focusedValue) {
          const idx = nextState.visibleOptions.findIndex((o) => o.value === focusedValue);
          if (idx !== -1) {
            const itemHeight = config.itemHeight ?? 35;
            const containerHeight = config.containerHeight ?? 300;
            const itemTop = idx * itemHeight;
            const itemBottom = itemTop + itemHeight;

            if (itemTop < currentScrollTop) {
              currentScrollTop = itemTop;
            } else if (itemBottom > currentScrollTop + containerHeight) {
              currentScrollTop = itemBottom - containerHeight;
            }
          }
        }
      }
    }

    nextState.scrollTop = currentScrollTop;
    lastScrollTop = currentScrollTop;

    // ── Check for changes ─────────────────────────────────────────────────────
    const hasChanges = (Object.keys(nextState) as Array<keyof SelectState>).some((key) => {
      const val = nextState[key];
      const current = state[key];

      if (val === current) return false;

      if (Array.isArray(val) && Array.isArray(current)) {
        if (val.length !== current.length) return true;
        for (let i = 0; i < val.length; i++) {
          if (val[i] !== current[i]) return true;
        }
        return false;
      }

      return val !== current;
    });

    if (!hasChanges && !change && !forceSync && !config.virtualize) return;

    if (config.virtualize) {
      const visible = nextState.visibleOptions;
      const nextVirtualization = calculateVirtualization(
        visible.length,
        config.itemHeight ?? 35,
        config.containerHeight ?? 300,
        lastScrollTop,
      );

      const currentVirt = state.virtualization;
      const virtChanged =
        !currentVirt ||
        currentVirt.startIndex !== nextVirtualization.startIndex ||
        currentVirt.endIndex !== nextVirtualization.endIndex ||
        currentVirt.totalHeight !== nextVirtualization.totalHeight;

      if (!virtChanged && !hasChanges && !change && !forceSync) return;

      nextState.virtualization = nextVirtualization;
    } else {
      nextState.virtualization = undefined;
    }

    const needsNativeSync =
      forceSync ||
      nextState.selectedValues !== state.selectedValues ||
      nextState.resolvedOptions !== state.resolvedOptions;

    state = nextState;

    if (change && config.onChange) {
      const multiple = config.multiple ?? false;
      const patchValue = patch.selectedValues;
      const intendedEmit = patchValue
        ? multiple
          ? patchValue
          : (patchValue[0] ?? '')
        : multiple
          ? state.selectedValues
          : (state.selectedValues[0] ?? '');

      config.onChange(intendedEmit, change);
    }

    if (config.hydrateFrom && needsNativeSync) {
      isInternalSync = true;
      try {
        const el = config.hydrateFrom;

        const nativeOptions = el.options;
        const resolvedOptions = state.resolvedOptions;

        const hasGroups = resolvedOptions.some((o) => !!o.groupLabel);
        const nativeHasGroups = el.getElementsByTagName('optgroup').length > 0;

        let needsFullRefresh =
          nativeOptions.length !== resolvedOptions.length || hasGroups !== nativeHasGroups;
        
        const optionsActuallyChanged = nextState.resolvedOptions !== state.resolvedOptions;

        if (!needsFullRefresh && !forceSync) {
          const nextSel = nextState.selectedValues ?? state.selectedValues;
          const prevSel = state.selectedValues;

          const removed = prevSel.filter((v) => !nextSel.includes(v));
          const added = nextSel.filter((v) => !prevSel.includes(v));

          if (removed.length > 0 || added.length > 0) {
            for (let i = 0; i < resolvedOptions.length; i++) {
              const val = resolvedOptions[i].value;
              if (added.includes(val)) {
                nativeOptions[i].selected = true;
              } else if (removed.includes(val)) {
                nativeOptions[i].selected = false;
              }
            }
          }
        }

        if (!needsFullRefresh && optionsActuallyChanged && resolvedOptions.length > 0) {
          for (let i = 0; i < resolvedOptions.length; i++) {
            if (
              nativeOptions[i].value !== resolvedOptions[i].value ||
              nativeOptions[i].text !== resolvedOptions[i].label
            ) {
              needsFullRefresh = true;
              break;
            }
          }
        }

        if (needsFullRefresh || forceSync) {
          el.innerHTML = '';
          const fragment = document.createDocumentFragment();

          const groups = new Map<string | undefined, SelectOption[]>();
          resolvedOptions.forEach((opt) => {
            const group = opt.groupLabel;
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group)!.push(opt);
          });

          const currentValues = new Set(nextState.selectedValues ?? state.selectedValues);
          
          groups.forEach((groupOptions, groupLabel) => {
            if (groupLabel) {
              const groupEl = document.createElement('optgroup');
              groupEl.label = groupLabel;
              groupOptions.forEach((opt) => {
                const isSelected = currentValues.has(opt.value);
                groupEl.appendChild(new Option(opt.label, opt.value, isSelected, isSelected));
              });
              fragment.appendChild(groupEl);
            } else {
              groupOptions.forEach((opt) => {
                const isSelected = currentValues.has(opt.value);
                fragment.appendChild(new Option(opt.label, opt.value, isSelected, isSelected));
              });
            }
          });

          el.appendChild(fragment);
        }

        if (!config.multiple && state.selectedValues.length > 0) {
          if (el.value !== state.selectedValues[0]) {
            el.value = state.selectedValues[0];
          }
        }
      } finally {
        isInternalSync = false;
      }
    }

    emit();
  }

  const ctx: SelectContext = {
    getState: () => state,
    setState,
    getConfig: () => config,
    instanceId,
    listboxId,
  };

  const actions = createActions(ctx, cache);
  const handlers = createHandlers(ctx, actions);
  const getters = createGetters(ctx, actions, handlers);

  const { call: debouncedNativeChange, cancel: cancelNativeChange } = debounce<[]>(() => {
    const el = config.hydrateFrom;
    if (!el || isInternalSync) return;

    const nextValues = Array.from(el.selectedOptions).map((opt) => opt.value);
    const currentValues = ctx.getState().selectedValues;

    const currentOptions = ctx.getState().resolvedOptions;
    const nativeOptions = el.options;

    let optionsChanged = nativeOptions.length !== currentOptions.length;
    if (!optionsChanged) {
      for (let i = 0; i < Math.min(nativeOptions.length, 10); i++) {
        if (nativeOptions[i].value !== currentOptions[i].value) {
          optionsChanged = true;
          break;
        }
      }
    }

    if (optionsChanged) {
      const nextOptions = flattenOptions(hydrateFromElement(el).options);
      ctx.setState(
        {
          resolvedOptions: nextOptions,
          visibleOptions: computeVisibleOptions(
            config,
            nextOptions,
            ctx.getState().search,
            nextValues,
          ),
          selectedValues: config.multiple ? nextValues : [nextValues[0] || ''],
        },
        { type: 'select', option: null },
      );
    } else {
      const selectionChanged =
        nextValues.length !== currentValues.length ||
        nextValues.some((v, i) => v !== currentValues[i]);

      if (selectionChanged) {
        const added = nextValues.filter((v) => !currentValues.includes(v));
        const removed = currentValues.filter((v) => !nextValues.includes(v));

        const change: SelectChange =
          added.length > 0
            ? { type: 'select', option: currentOptions.find((o) => o.value === added[0]) || null }
            : removed.length > 0
              ? {
                  type: 'deselect',
                  option: currentOptions.find((o) => o.value === removed[0]) || null,
                }
              : { type: 'clear', option: null };

        ctx.setState(
          {
            selectedValues: config.multiple ? nextValues : [nextValues[0] || ''],
          },
          change,
        );
      }
    }
  }, 50);

  const handleNativeChange = () => debouncedNativeChange();

  let observer: MutationObserver | null = null;

  function setupHydrationListeners(el: HTMLSelectElement | undefined) {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (el) {
      el.addEventListener('change', handleNativeChange);
      observer = new MutationObserver(() => handleNativeChange());
      observer.observe(el, { childList: true, subtree: true, characterData: true });
    }
  }

  function cleanupHydrationListeners(el: HTMLSelectElement | undefined) {
    if (el) {
      el.removeEventListener('change', handleNativeChange);
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  setupHydrationListeners(config.hydrateFrom);

  setState(state, undefined, true);

  const originalDestroy = actions.destroy;
  actions.destroy = () => {
    cleanupHydrationListeners(config.hydrateFrom);
    cancelNativeChange();
    originalDestroy();
  };

  return {
    getState: () => state,
    getConfig: () => config,
    subscribe: (listener: (s: SelectState) => void): Unsubscribe => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    open: actions.open,
    close: actions.close,
    toggle: actions.toggle,
    selectOption: actions.selectOption,
    deselectOption: actions.deselectOption,
    toggleOption: actions.toggleOption,
    clearAll: actions.clearAll,
    setSearch: actions.setSearch,
    createOption: actions.createOption,
    scrollToFocused: (container: HTMLElement) => {
      const focusedValue = state.focusedOptionValue;
      if (!focusedValue) return;

      if (config.virtualize) {
        const idx = state.visibleOptions.findIndex((o) => o.value === focusedValue);
        if (idx !== -1) {
          const itemHeight = config.itemHeight ?? 35;
          const containerHeight = config.containerHeight ?? 300;
          const itemTop = idx * itemHeight;
          const itemBottom = itemTop + itemHeight;

          if (itemTop < container.scrollTop) {
            container.scrollTop = itemTop;
          } else if (itemBottom > container.scrollTop + containerHeight) {
            container.scrollTop = itemBottom - containerHeight;
          }
        }
      } else {
        const optionId = getOptionId(instanceId, focusedValue);
        const element = container.querySelector(`[id="${optionId}"]`) as HTMLElement;
        if (element) {
          scrollIntoView(container, element);
        }
      }
    },
    sync: () => debouncedNativeChange(),
    onScroll: (scrollTop: number) => {
      lastScrollTop = scrollTop;
      if (config.virtualize) {
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(() => {
          setState({ scrollTop });
        });
      }
    },

    focusOption: handlers.focusOption,
    focusNext: handlers.focusNext,
    focusPrev: handlers.focusPrev,
    focusFirst: handlers.focusFirst,
    focusLast: handlers.focusLast,

    setConfig: (patch: Partial<SelectConfig>) => {
      const prevOptions = config.options;
      const prevHydrateFrom = config.hydrateFrom;
      config = { ...config, ...patch };

      const nextState: Partial<SelectState> = {};
      let forceSync = false;

      if (patch.hydrateFrom !== undefined && patch.hydrateFrom !== prevHydrateFrom) {
        cleanupHydrationListeners(prevHydrateFrom);
        setupHydrationListeners(patch.hydrateFrom);
        forceSync = true;

        if (patch.hydrateFrom) {
          const h = hydrateFromElement(patch.hydrateFrom);
          if (config.multiple === undefined) {
            config.multiple = h.multiple;
          }
          hydratedOptions = flattenOptions(h.options);
          hydratedSelectedValues = h.selectedValues;
        } else {
          hydratedOptions = [];
          hydratedSelectedValues = [];
        }
      }

      let optionsChanged = false;
      if (patch.options !== undefined) {
        if (Array.isArray(patch.options) && Array.isArray(prevOptions)) {
          if (patch.options.length !== prevOptions.length) {
            optionsChanged = true;
          } else {
            for (let i = 0; i < patch.options.length; i++) {
              if (patch.options[i] !== prevOptions[i]) {
                optionsChanged = true;
                break;
              }
            }
          }
        } else if (patch.options !== prevOptions) {
          optionsChanged = true;
        }
      }

      const hydrateChanged =
        patch.hydrateFrom !== undefined && patch.hydrateFrom !== prevHydrateFrom;

      if (optionsChanged || hydrateChanged) {
        const currentStaticOptions = flattenOptions(config.options ?? []);
        nextState.resolvedOptions = mergeOptions(hydratedOptions, currentStaticOptions);
      } else {
        nextState.resolvedOptions = state.resolvedOptions;
      }

      if (config.value !== undefined) {
        nextState.selectedValues = Array.isArray(config.value) ? config.value : [config.value];
      } else if (patch.hydrateFrom !== undefined && patch.hydrateFrom !== prevHydrateFrom) {
        nextState.selectedValues = (config.defaultValue ?? hydratedSelectedValues) as string[];
      }

      nextState.visibleOptions = computeVisibleOptions(
        config,
        nextState.resolvedOptions ?? state.resolvedOptions,
        state.search,
        nextState.selectedValues ?? state.selectedValues,
      );

      setState(nextState, undefined, forceSync);
    },
    destroy: () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      actions.destroy();
      cache.clear();
      listeners.clear();
    },

    ...getters,

    getOptionLabel: (value: string) =>
      state.resolvedOptions.find((o) => o.value === value)?.label ?? value,
    getSelectedOptions: () =>
      state.resolvedOptions.filter((o) => state.selectedValues.includes(o.value)),
  };
}
