import type {
  SelectChange,
  SelectConfig,
  SelectInstance,
  SelectState,
  Unsubscribe,
  SelectOption,
} from '@/core/types';
import {
  computeVisibleOptions,
  debounce,
  flattenOptions,
  getOptionId,
  hydrateFromElement,
  mergeOptions,
  scrollIntoView,
  uid,
} from '@/utils/index';
import { calculateVirtualization } from '@/features/virtualization';
import { OptionsCache } from '@/core/cache';
import { SelectContext } from '@/core/context';
import { createActions } from '@/logic/index';
import { createHandlers } from '@/handlers/index';
import { createGetters } from '@/getters/index';

// ─── useSelect ─────────────────────────────────────────────────────────────

/**
 * Creates a headless select instance.
 *
 * The instance manages all state internally and notifies subscribers on every
 * change. Consumers wire up their own HTML via the prop getter methods.
 */
export function useSelect(initialConfig: SelectConfig): SelectInstance {
  // ── Internal IDs ────────────────────────────────────────────────────────────
  const instanceId = uid('hselect');
  const listboxId = `${instanceId}-listbox`;

  // ── Config & State ──────────────────────────────────────────────────────────
  let config: SelectConfig = { ...initialConfig };
  const cache = new OptionsCache();

  // ── Hydration (Internal Tracking) ───────────────────────────────────────────
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
  };

  // ── Subscribers ──────────────────────────────────────────────────────────────
  const listeners = new Set<(s: SelectState) => void>();
  let isInternalSync = false;
  let lastScrollTop = 0;
  let scrollRaf: number | null = null;

  function emit(): void {
    for (const fn of listeners) fn(state);
  }

  function setState(patch: Partial<SelectState>, change?: SelectChange, forceSync = false): void {
    const nextState = { ...state, ...patch };

    // Controlled mode override: if parent owns the value, internal state
    // must always reflect config.value.
    if (config.value !== undefined) {
      nextState.selectedValues = Array.isArray(config.value) ? config.value : [config.value];
    }

    // ── Check for changes ─────────────────────────────────────────────────────
    const hasChanges = (Object.keys(nextState) as Array<keyof SelectState>).some((key) => {
      const val = nextState[key];
      const current = state[key];

      // Special handling for arrays to avoid reference-only change loops
      if (Array.isArray(val) && Array.isArray(current)) {
        if (val.length !== current.length) return true;
        for (let i = 0; i < val.length; i++) {
          if (val[i] !== current[i]) return true;
        }
        return false;
      }

      return val !== current;
    });

    // Always proceed if there's an explicit change metadata (event-driven) or forceSync
    if (!hasChanges && !change && !forceSync && !config.virtualize) return;

    // ── Virtualization Calculation ────────────────────────────────────────────
    if (config.virtualize) {
      const visible = nextState.visibleOptions;
      const nextVirtualization = calculateVirtualization(
        visible.length,
        config.itemHeight ?? 35,
        config.containerHeight ?? 300,
        lastScrollTop,
      );

      // Only proceed if virtualization actually changed OR there were other changes
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

    state = nextState;

    // ── Notify ────────────────────────────────────────────────────────────────
    // We notify after updating the internal state to avoid re-entrancy issues
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

    // ── Sync to Native ────────────────────────────────────────────────────────
    if (config.hydrateFrom) {
      isInternalSync = true;
      try {
        const el = config.hydrateFrom;

        // 1. Update options list if they've changed
        const nativeOptions = el.options;
        const resolvedOptions = state.resolvedOptions;

        // Check if we need a full refresh of options
        const hasGroups = resolvedOptions.some((o) => !!o.groupLabel);
        const nativeHasGroups = el.getElementsByTagName('optgroup').length > 0;

        let needsFullRefresh =
          nativeOptions.length !== resolvedOptions.length || hasGroups !== nativeHasGroups;
        if (!needsFullRefresh && resolvedOptions.length > 0) {
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
          // Clear and repopulate while preserving groups
          el.innerHTML = '';
          const fragment = document.createDocumentFragment();

          const groups = new Map<string | undefined, any[]>();
          resolvedOptions.forEach((opt) => {
            const group = opt.groupLabel;
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group)!.push(opt);
          });

          groups.forEach((groupOptions, groupLabel) => {
            if (groupLabel) {
              const groupEl = document.createElement('optgroup');
              groupEl.label = groupLabel;
              groupOptions.forEach((opt) => {
                groupEl.appendChild(new Option(opt.label, opt.value));
              });
              fragment.appendChild(groupEl);
            } else {
              groupOptions.forEach((opt) => {
                fragment.appendChild(new Option(opt.label, opt.value));
              });
            }
          });

          el.appendChild(fragment);
        }

        // 2. Update selection state
        const currentValues = new Set(state.selectedValues);
        Array.from(el.options).forEach((opt) => {
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
  const { call: debouncedNativeChange, cancel: cancelNativeChange } = debounce<[]>(() => {
    const el = config.hydrateFrom;
    if (!el || isInternalSync) return;

    const nextValues = Array.from(el.selectedOptions).map((opt) => opt.value);
    const currentValues = ctx.getState().selectedValues;

    // 1. Check if options changed (structural change)
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
      // 2. Check if selection changed
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

  // Watch for structural changes (adding/removing <option> elements)
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

  // ── Initial Sync ───────────────────────────────────────────────────────────
  // Ensure the native select is in sync with the initial state
  setState(state, undefined, true);

  const originalDestroy = actions.destroy;
  actions.destroy = () => {
    cleanupHydrationListeners(config.hydrateFrom);
    cancelNativeChange();
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
    sync: () => debouncedNativeChange(),
    onScroll: (scrollTop: number) => {
      lastScrollTop = scrollTop;
      if (config.virtualize) {
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(() => {
          setState({});
        });
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

      const currentStaticOptions = flattenOptions(config.options ?? []);
      nextState.resolvedOptions = mergeOptions(hydratedOptions, currentStaticOptions);

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

    // Prop Getters
    ...getters,

    // Helpers
    getOptionLabel: (value: string) =>
      state.resolvedOptions.find((o) => o.value === value)?.label ?? value,
    getSelectedOptions: () =>
      state.resolvedOptions.filter((o) => state.selectedValues.includes(o.value)),
  };
}
