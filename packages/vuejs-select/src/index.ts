import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useSelect as headlessSelect, SelectConfig, SelectState } from '@verbpatch/headless-select';

export * from '@verbpatch/headless-select';

export function useSelect(config: SelectConfig) {
  const instance = headlessSelect(config);
  const state = ref<SelectState>(instance.getState());

  watch(
    () => ({ ...config }),
    (newConfig) => {
      instance.setConfig(newConfig);
    },
    { deep: true },
  );

  let unsubscribe: () => void;

  onMounted(() => {
    unsubscribe = instance.subscribe((newState) => {
      state.value = newState;
    });
  });

  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
    instance.destroy();
  });

  return {
    state,
    instance,
    getTriggerProps: () => instance.getTriggerProps(),
    getListboxProps: () => instance.getListboxProps(),
    getOptionProps: (value: string) => instance.getOptionProps(value),
    getSearchInputProps: () => instance.getSearchInputProps(),
    getNativeSelectProps: () => instance.getNativeSelectProps(),
    getCreateOptionProps: () => instance.getCreateOptionProps(),
    getClearOptionProps: (value: string) => instance.getClearOptionProps(value),
    setConfig: (patch: Partial<SelectConfig>) => instance.setConfig(patch),
  };
}
