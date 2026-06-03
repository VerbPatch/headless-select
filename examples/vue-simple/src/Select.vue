<script setup lang="ts">
import { useSelect, type SelectConfig } from '@verbpatch/vuejs-select';
import { ref, onMounted, watch, nextTick } from 'vue';

interface Props {
  virtualize?: boolean;
  itemHeight?: number;
  containerHeight?: number;
  showNative?: boolean;
  hideNative?: boolean;
  options?: any[];
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  placeholder?: string;
  value?: string | string[];
  fetchRemoteOptions?: (search: string) => Promise<any[]>;
  onFetchError?: (error: Error) => void;
  cacheOptions?: boolean;
  defaultOptions?: boolean | any[];
}

const props = withDefaults(defineProps<Props>(), {
  virtualize: false,
  itemHeight: 35,
  containerHeight: 300,
  showNative: true,
  hideNative: false,
  options: () => [],
  multiple: false,
  searchable: undefined,
  creatable: false,
  placeholder: 'Select...',
  cacheOptions: false,
  defaultOptions: false,
});

const emit = defineEmits(['change']);

// Setup headless-select
const {
  state,
  instance,
  getTriggerProps,
  getListboxProps,
  getOptionProps,
  getSearchInputProps,
  getNativeSelectProps,
  getCreateOptionProps,
  getClearOptionProps,
  setConfig,
} = useSelect(() => ({
  options: props.options,
  multiple: props.multiple,
  searchable: props.searchable,
  creatable: props.creatable,
  placeholder: props.placeholder,
  value: props.value,
  virtualize: props.virtualize,
  itemHeight: props.itemHeight,
  containerHeight: props.containerHeight,
  fetchRemoteOptions: props.fetchRemoteOptions,
  onFetchError: props.onFetchError,
  cacheOptions: props.cacheOptions,
  defaultOptions: props.defaultOptions,
  onChange: (val) => {
    emit('change', val);
  },
}));

// Render updates tracking
const renderCount = ref(1);
watch(
  () => state.value,
  () => {
    renderCount.value++;
  },
  { deep: true },
);

const nativeSelectRef = ref<HTMLSelectElement | null>(null);
const listboxRef = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log('Select mounted, config:', instance.getConfig());
  if (nativeSelectRef.value) {
    setConfig({ hydrateFrom: nativeSelectRef.value });
  }
});

// Reactively bind listboxRef.value.scrollTop to state.value.scrollTop
watch(
  [() => state.value.isOpen, () => state.value.scrollTop],
  ([isOpen, scrollTop]) => {
    if (isOpen && listboxRef.value) {
      if (listboxRef.value.scrollTop !== scrollTop) {
        listboxRef.value.scrollTop = scrollTop;
      }
    }
  },
  { flush: 'post' },
);

// Helper methods that match React/Solid getSelectedOptions and getOptionLabel
const getSelectedOptions = () => {
  return state.value.resolvedOptions.filter((o) => state.value.selectedValues.includes(o.value));
};

const getOptionLabel = (val: string) => {
  return state.value.resolvedOptions.find((o) => o.value === val)?.label ?? val;
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  instance.onScroll(target.scrollTop);
};
</script>

<template>
  <div class="select-container">
    <div class="render-count-badge">Render Updates: {{ renderCount }}</div>

    <div
      v-if="props.showNative"
      class="native-interface-container"
      :class="{ hidden: props.hideNative }"
    >
      <label v-if="!props.hideNative">Native Select Interface</label>
      <select
        ref="nativeSelectRef"
        v-bind="{ ...getNativeSelectProps(), style: undefined }"
        class="native-select"
        :class="{ hidden: props.hideNative, visible: !props.hideNative }"
        :style="
          props.hideNative
            ? getNativeSelectProps().style
            : { height: props.multiple || props.virtualize ? '120px' : 'auto' }
        "
      >
        <slot />
      </select>
      <div v-if="!props.hideNative" class="native-note">
        ↑ Native &lt;select&gt; element. 2-way sync active.
        <span v-if="props.virtualize"> (10k items sync might be heavy)</span>
      </div>
    </div>

    <div class="custom-ui-wrapper">
      <label>Headless Custom UI <span v-if="props.virtualize">(Virtualized)</span></label>
      <div v-if="!props.showNative" class="custom-ui-note">(Pure Headless - No Native Sync)</div>

      <button v-bind="getTriggerProps()" class="select-trigger">
        <div v-if="state.selectedValues.length > 0">
          <div v-if="props.multiple" class="selected-values-container">
            <span v-for="opt in getSelectedOptions()" :key="opt.value" class="selected-value-pill">
              {{ opt.label }}
              <span v-bind="getClearOptionProps(opt.value)" class="selected-value-clear"> × </span>
            </span>
          </div>
          <span v-else>
            {{ getOptionLabel(state.selectedValues[0]) }}
          </span>
        </div>
        <span v-else>
          {{ props.placeholder || 'Select...' }}
        </span>
      </button>

      <div v-if="state.isOpen" class="select-dropdown">
        <div v-if="props.searchable !== false" class="search-container">
          <input
            v-bind="getSearchInputProps()"
            :value="state.search"
            class="search-input"
            :placeholder="props.virtualize ? 'Search 10,000 items...' : 'Search options...'"
            ref="searchInput"
            autofocus
          />
        </div>

        <div
          v-bind="getListboxProps()"
          ref="listboxRef"
          @scroll="handleScroll"
          class="listbox-container"
          :style="{
            maxHeight: props.virtualize ? `${props.containerHeight}px` : '250px',
            height: props.virtualize ? `${props.containerHeight}px` : 'auto',
          }"
        >
          <div v-if="state.isLoading" class="loading-state">Loading...</div>
          <template v-else>
            <template v-if="props.virtualize && state.virtualization">
              <div
                :style="{
                  height: `${state.virtualization.totalHeight}px`,
                  width: '100%',
                  position: 'relative',
                }"
              >
                <div
                  v-for="(opt, idx) in state.visibleOptions.slice(
                    state.virtualization.startIndex,
                    state.virtualization.endIndex,
                  )"
                  :key="opt.value"
                  v-bind="getOptionProps(opt.value)"
                  class="option-item"
                  :class="{
                    focused: getOptionProps(opt.value)['data-focused'],
                    selected: getOptionProps(opt.value)['aria-selected'],
                    disabled: opt.disabled,
                  }"
                  :style="{
                    position: 'absolute',
                    top: `${(state.virtualization.startIndex + idx) * props.itemHeight}px`,
                    height: `${props.itemHeight}px`,
                    width: '100%',
                    boxSizing: 'border-box',
                  }"
                >
                  <span class="option-icon">
                    {{ getOptionProps(opt.value)['aria-selected'] ? '●' : '○' }}
                  </span>
                  <div class="option-label-container">
                    <span>{{ opt.label }}</span>
                  </div>
                  <span v-if="getOptionProps(opt.value)['data-focused']" class="option-focus-badge"
                    >[FOCUS]</span
                  >
                </div>
              </div>
            </template>
            <template v-else>
              <div
                v-for="opt in state.visibleOptions"
                :key="opt.value"
                v-bind="getOptionProps(opt.value)"
                class="option-item"
                :class="{
                  focused: getOptionProps(opt.value)['data-focused'],
                  selected: getOptionProps(opt.value)['aria-selected'],
                  disabled: opt.disabled,
                }"
              >
                <span class="option-icon">
                  {{ getOptionProps(opt.value)['aria-selected'] ? '●' : '○' }}
                </span>
                <div class="option-label-container">
                  <span>{{ opt.label }}</span>
                  <span v-if="opt.groupLabel" class="option-group-label">{{ opt.groupLabel }}</span>
                </div>
                <span v-if="getOptionProps(opt.value)['data-focused']" class="option-focus-badge"
                  >[FOCUS]</span
                >
              </div>
            </template>

            <div v-if="state.canCreate" v-bind="getCreateOptionProps()" class="create-option">
              + Create "{{ state.search }}"
            </div>

            <div v-if="state.visibleOptions.length === 0 && !state.canCreate" class="empty-state">
              No results found
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
