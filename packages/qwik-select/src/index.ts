import {
  useStore,
  useTask$,
  useVisibleTask$,
  $,
  noSerialize,
  type NoSerialize,
  useSignal,
} from '@builder.io/qwik';
import {
  useSelect as headlessSelect,
  type SelectConfig,
  type SelectState,
  type SelectInstance,
} from '@verbpatch/headless-select';
export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const instanceSig = useSignal<NoSerialize<SelectInstance>>();

  const getInstance = () => {
    if (!instanceSig.value) {
      const inst = headlessSelect(config);
      instanceSig.value = noSerialize(inst);
    }
    return instanceSig.value!;
  };

  useTask$(({ track }) => {
    const keys = Object.keys(config) as Array<keyof SelectConfig>;
    const resolvedConfig = {} as SelectConfig;
    for (const key of keys) {
      track(() => config[key]);
      resolvedConfig[key] = config[key] as any;
    }
    getInstance().setConfig(resolvedConfig);
  });

  const store = useStore({
    state: getInstance().getState(),
    lastScrollTime: 0,
  });

  useVisibleTask$(() => {
    const instance = getInstance();
    const unsubscribe = instance.subscribe((newState) => {
      for (const key of Object.keys(newState) as Array<keyof SelectState>) {
        (store.state as any)[key] = newState[key];
      }
    });
    return () => {
      unsubscribe();
      instance.destroy();
    };
  });

  return {
    store,
    instance: {
      ...getInstance(),
      onScroll: (scrollTop: number) => {
        store.lastScrollTime = Date.now();
        getInstance().onScroll(scrollTop);
      },
    } as any,
    getTriggerProps: () => {
      const props = getInstance().getTriggerProps();
      return {
        role: props.role,
        'aria-expanded': props['aria-expanded'],
        'aria-haspopup': props['aria-haspopup'],
        'aria-controls': props['aria-controls'],
        'aria-label': props['aria-label'],
        'aria-labelledby': props['aria-labelledby'],
        'aria-disabled': props['aria-disabled'],
        tabIndex: props.tabIndex,
        onClick$: $(() => getInstance().toggle()),
        onKeyDown$: $((e: KeyboardEvent) => getInstance().handleKeyDown(e)),
      };
    },
    getListboxProps: () => {
      const props = getInstance().getListboxProps();
      return {
        id: props.id,
        role: props.role,
        'aria-label': props['aria-label'],
        'aria-labelledby': props['aria-labelledby'],
        'aria-multiselectable': props['aria-multiselectable'],
      };
    },
    getOptionProps: (value: string) => {
      const props = getInstance().getOptionProps(value);
      return {
        id: props.id,
        role: props.role,
        'aria-selected': props['aria-selected'],
        'aria-disabled': props['aria-disabled'],
        'data-focused': props['data-focused'],
        onClick$: $((e: MouseEvent) => {
          e.preventDefault();
          if (props['aria-disabled']) return;
          getInstance().toggleOption(value);
        }),
        onMouseEnter$: $(() => {
          if (Date.now() - store.lastScrollTime < 100) return;
          if (!props['aria-disabled']) getInstance().focusOption(value);
        }),
      };
    },
    getSearchInputProps: () => {
      const props = getInstance().getSearchInputProps();
      return {
        id: props.id,
        type: props.type,
        role: props.role,
        autoComplete: props.autoComplete,
        'aria-autocomplete': props['aria-autocomplete'],
        'aria-controls': props['aria-controls'],
        'aria-activedescendant': props['aria-activedescendant'],
        value: props.value,
        onInput$: $((e: Event) => {
          getInstance().setSearch((e.target as HTMLInputElement).value);
        }),
        onKeyDown$: $((e: KeyboardEvent) => getInstance().handleKeyDown(e)),
      };
    },
    getNativeSelectProps: () => {
      const props = getInstance().getNativeSelectProps();
      return {
        multiple: props.multiple,
        disabled: props.disabled,
        'aria-hidden': props['aria-hidden'],
        tabIndex: props.tabIndex,
        style: props.style,
      };
    },
    getCreateOptionProps: () => {
      const props = getInstance().getCreateOptionProps();
      if (!props) return null;
      return {
        role: props.role,
        'aria-label': props['aria-label'],
        onClick$: $(() => getInstance().createOption(store.state.search || '')),
      };
    },
    getClearOptionProps: (value: string) => {
      const props = getInstance().getClearOptionProps(value);
      return {
        role: props.role,
        'aria-label': props['aria-label'],
        onClick$: $((e: any) => {
          e.stopPropagation();
          getInstance().deselectOption(value);
        }),
      };
    },
  };
}
