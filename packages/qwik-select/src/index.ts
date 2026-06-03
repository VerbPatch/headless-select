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
  const store = useStore({
    state: {} as SelectState,
  });

  const instanceSig = useSignal<NoSerialize<SelectInstance>>();

  const getInstance = () => {
    if (!instanceSig.value) {
      const inst = headlessSelect(config);
      instanceSig.value = noSerialize(inst);
    }
    return instanceSig.value!;
  };

  useTask$(() => {
    const instance = getInstance();
    const initialState = instance.getState();
    for (const key of Object.keys(initialState) as Array<keyof SelectState>) {
      (store.state as any)[key] = initialState[key];
    }
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
    instance: getInstance(),
    getTriggerProps: $(() => getInstance().getTriggerProps()),
    getListboxProps: $(() => getInstance().getListboxProps()),
    getOptionProps: $((value: string) => getInstance().getOptionProps(value)),
    getSearchInputProps: $(() => getInstance().getSearchInputProps()),
    getNativeSelectProps: $(() => getInstance().getNativeSelectProps()),
    getCreateOptionProps: $(() => getInstance().getCreateOptionProps()),
    getClearOptionProps: $((value: string) => getInstance().getClearOptionProps(value)),
  };
}
