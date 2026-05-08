import type {
  SelectChange,
  SelectConfig,
  SelectInstance,
  SelectState,
  Unsubscribe,
} from './core/types.js';
import {
  computeVisibleOptions,
  debounce,
  flattenOptions,
  getOptionId,
  hydrateFromElement,
  scrollIntoView,
  uid,
} from './utils/index.js';
import { OptionsCache } from './core/cache.js';
import { SelectContext } from './core/context.js';
import { createActions } from './logic/index.js';
import { createHandlers } from './handlers/index.js';
import { createGetters } from './getters/index.js';

// ─── useSelect ─────────────────────────────────────────────────────────────

/**
 * Creates a headless select instance.
 *
 * The instance manages all state internally and notifies subscribers on every
 * change. Consumers wire up their own HTML via the prop getter methods.
 */
export function useSelect(initialConfig: SelectConfig): SelectInstance {
  // ── Enforce mandatory hydrateFrom ───────────────────────────────────────────
  if (!initialConfig || !initialConfig.hydrateFrom) {
    throw new Error('HeadlessSelect: initialConfig and initialConfig.hydrateFrom are mandatory. Without a select element headless-select will not work.');
  }

  // ── Internal IDs ────────────────────────────────────────────────────────────
  const instanceId = uid('hselect');
  const listboxId = `${instanceId}-listbox`;

  // ── Config & State ──────────────────────────────────────────────────────────
  let config: SelectConfig = { ...initialConfig };
  const cache = new OptionsCache();

  // ── Hydration (Initial) ────────────────────────────────────────────────────
  const h = hydrateFromElement(config.hydrateFrom);
  const hydratedOptions = h.options;
  const hydratedSelected = h.selectedValues;
  if (config.multiple === undefined) {
    config = { ...config, multiple: h.multiple };
  }

  const staticOptions = flattenOptions([...hydratedOptions, ...(config.options ?? [])]);

  function resolveInitialSelected(): string[] {
    const raw = config.value ?? config.defaultValue ?? hydratedSelected;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.length > 0) return [raw];
    return [];
  }

  let state: SelectState = {
    isOpen: false,
    search: '',
    selectedValues: resolveInitialSelected(),
    resolvedOptions: staticOptions,
    visibleOptions: computeVisibleOptions(config, staticOptions, '', resolveInitialSelected()),
    focusedOptionValue: null,
    canCreate: false,
    isLoading: false,
    error: null,
  };

  // ── Subscribers ──────────────────────────────────────────────────────────────
  const listeners = new Set<(s: SelectState) => void>();
  let isInternalSync = false;

  function emit(): void {
    for (const fn of listeners) fn(state);
  }

  function setState(patch: Partial<SelectState>, change?: SelectChange): void {
    // ── Check for changes ─────────────────────────────────────────────────────
    const hasChanges = (Object.keys(patch) as Array<keyof SelectState>).some(
      (key) => patch[key] !== state[key],
    );

    // Always proceed if there's an explicit change metadata (event-driven)
    if (!hasChanges && !change) return;

    const nextState = { ...state, ...patch };

    // Controlled mode override: if parent owns the value, internal state 
    // must always reflect config.value.
    if (config.value !== undefined) {
      nextState.selectedValues = Array.isArray(config.value) ? config.value : [config.value];
    }

    state = nextState;

    // ── Notify ────────────────────────────────────────────────────────────────
    // We notify after updating the internal state to avoid re-entrancy issues
    if (change && config.onChange) {
      const multiple = config.multiple ?? false;
      const patchValue = patch.selectedValues;
      const intendedEmit = patchValue
        ? multiple
          ? patchValue
          : patchValue[0] ?? ''
        : multiple
          ? state.selectedValues
          : state.selectedValues[0] ?? '';

      config.onChange(intendedEmit, change);
    }

    // ── Sync to Native ────────────────────────────────────────────────────────
    isInternalSync = true;
    try {
      const el = config.hydrateFrom;

      // 1. Update options list if they've changed
      // We check length and first/last elements as a fast heuristic before deeper checks
      const nativeOptions = el.options;
      const resolvedOptions = state.resolvedOptions;

      let needsOptionSync = nativeOptions.length !== resolvedOptions.length;
      if (!needsOptionSync && resolvedOptions.length > 0) {
        if (nativeOptions[0].value !== resolvedOptions[0].value || 
            nativeOptions[nativeOptions.length - 1].value !== resolvedOptions[resolvedOptions.length - 1].value) {
          needsOptionSync = true;
        }
      }

      if (needsOptionSync) {
        const nativeValues = new Set(Array.from(nativeOptions).map(o => o.value));
        const fragment = document.createDocumentFragment();
        let added = false;

        resolvedOptions.forEach((opt) => {
          if (!nativeValues.has(opt.value)) {
            fragment.appendChild(new Option(opt.label, opt.value));
            added = true;
          }
        });

        if (added) {
          el.appendChild(fragment);
        }
      }

      // 2. Update selection state
      const currentValues = new Set(state.selectedValues);
      Array.from(nativeOptions).forEach((opt) => {
        const shouldBeSelected = currentValues.has(opt.value);
        if (opt.selected !== shouldBeSelected) {
          opt.selected = shouldBeSelected;
        }
      });

      // For single select, also ensure el.value is correct
      if (!config.multiple && state.selectedValues.length > 0) {
        if (el.value !== state.selectedValues[0]) {
          el.value = state.selectedValues[0];
        }
      }
    } finally {
      isInternalSync = false;
    }

    emit();
  }

  // ── Context Wiring ──────────────────────────────────────────────────────────

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

  // ── Two-way Sync (Runtime) ──────────────────────────────────────────────────
  const el = config.hydrateFrom;
  
  const { call: debouncedNativeChange, cancel: cancelNativeChange } = debounce<[]>(() => {
    if (isInternalSync) return;
    const nextValues = Array.from(el.selectedOptions).map((opt) => opt.value);
    const currentValues = ctx.getState().selectedValues;

    // 1. Check if options changed (structural change)
    // We avoid JSON.stringify here for performance on large lists.
    const currentOptions = ctx.getState().resolvedOptions;
    const nativeOptions = el.options;
    
    let optionsChanged = nativeOptions.length !== currentOptions.length;
    if (!optionsChanged) {
      // Sample check or shallow loop check if lengths match
      for (let i = 0; i < Math.min(nativeOptions.length, 10); i++) {
        if (nativeOptions[i].value !== currentOptions[i].value) {
          optionsChanged = true;
          break;
        }
      }
    }

    if (optionsChanged) {
      const nextOptions = flattenOptions(hydrateFromElement(el).options);
      ctx.setState({
        resolvedOptions: nextOptions,
        visibleOptions: computeVisibleOptions(
          config,
          nextOptions,
          ctx.getState().search,
          nextValues,
        ),
        selectedValues: config.multiple ? nextValues : [nextValues[0] || ''],
      });
      syncOptionInterceptors(); 
    } else {
      // 2. Check if selection changed
      const selectionChanged = nextValues.length !== currentValues.length || 
        nextValues.some((v, i) => v !== currentValues[i]);
        
      if (selectionChanged) {
        ctx.setState({
          selectedValues: config.multiple ? nextValues : [nextValues[0] || ''],
        });
      }
    }
  }, 50);

  const handleNativeChange = () => debouncedNativeChange();

  el.addEventListener('change', handleNativeChange);

  // Intercept programmatic value/selectedIndex changes
  const valueDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const indexDescriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
  const optionSelectedDescriptor = Object.getOwnPropertyDescriptor(
    HTMLOptionElement.prototype,
    'selected',
  );

  const patchedOptions = new Set<HTMLOptionElement>();

  function syncOptionInterceptors() {
    if (!optionSelectedDescriptor) return;
    Array.from(el.options).forEach((opt) => {
      if (patchedOptions.has(opt)) return;
      Object.defineProperty(opt, 'selected', {
        get: optionSelectedDescriptor.get,
        set (v) {
          optionSelectedDescriptor.set!.call(this, v);
          handleNativeChange();
        },
        configurable: true,
      });
      patchedOptions.add(opt);
    });
  }

  if (valueDescriptor && indexDescriptor) {
    Object.defineProperties(el, {
      value: {
        get: valueDescriptor.get,
        set (v) {
          valueDescriptor.set!.call(this, v);
          handleNativeChange();
        },
        configurable: true,
      },
      selectedIndex: {
        get: indexDescriptor.get,
        set (v) {
          indexDescriptor.set!.call(this, v);
          handleNativeChange();
        },
        configurable: true,
      },
    });
  }

  syncOptionInterceptors();

  // Watch for structural changes (adding/removing <option> elements)
  const observer = new MutationObserver(() => handleNativeChange());
  observer.observe(el, { childList: true, subtree: true, characterData: true });

  const originalDestroy = actions.destroy;
  actions.destroy = () => {
    el.removeEventListener('change', handleNativeChange);
    cancelNativeChange();
    observer.disconnect();

    // Restore original descriptors
    if (valueDescriptor && indexDescriptor) {
      Object.defineProperties(el, {
        value: valueDescriptor,
        selectedIndex: indexDescriptor,
      });
    }

    if (optionSelectedDescriptor) {
      patchedOptions.forEach((opt) => {
        Object.defineProperty(opt, 'selected', optionSelectedDescriptor);
      });
    }

    originalDestroy();
  };

  // ── Public Instance ─────────────────────────────────────────────────────────

  return {
    getState: () => state,
    getConfig: () => config,
    subscribe: (listener: (s: SelectState) => void): Unsubscribe => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    // Core Actions
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
      const optionId = getOptionId(instanceId, focusedValue);
      const element = container.querySelector(`[id="${optionId}"]`) as HTMLElement;
      if (element) {
        scrollIntoView(container, element);
      }
    },

    // Keyboard/Focus
    focusOption: handlers.focusOption,
    focusNext: handlers.focusNext,
    focusPrev: handlers.focusPrev,
    focusFirst: handlers.focusFirst,
    focusLast: handlers.focusLast,

    // Lifecycle
    setConfig: (patch: Partial<SelectConfig>) => {
      const prevOptions = config.options;
      config = { ...config, ...patch };

      const nextState: Partial<SelectState> = {};

      if (patch.options && patch.options !== prevOptions) {
        nextState.resolvedOptions = flattenOptions(patch.options);
      }

      nextState.visibleOptions = computeVisibleOptions(
        config,
        nextState.resolvedOptions ?? state.resolvedOptions,
        state.search,
        state.selectedValues
      );

      setState(nextState);
    },
    destroy: () => {
      actions.destroy();
      cache.clear();
      listeners.clear();
    },

    // Prop Getters
    ...getters,

    // Helpers
    getOptionLabel: (value: string) =>
      state.resolvedOptions.find((o) => o.value === value)?.label ?? value,
    getSelectedOptions: () =>
      state.resolvedOptions.filter((o) => state.selectedValues.includes(o.value)),
  };
}
