<script setup lang="ts">
import { ref } from 'vue';
import Select from './Select.vue';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
];

const largeList = Array.from({ length: 10000 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}));

const multiValue = ref<string[]>(['apple', 'banana']);
const singleValue = ref<string>('banana');

const fetchRemoteOptions = async (search: string) => {
  if (!search) return [];
  const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const users = await res.json();
  console.log('fetch response', users, res);
  return users
    .filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()))
    .map((u: any) => ({ value: String(u.id), label: u.name }));
};
</script>

<template>
  <div style="padding: 2rem; max-width: 1000px; margin: 0 auto">
    <h1>Vue Headless Select Showcase</h1>
    <p>Demonstrating various configurations of the Vue adapter.</p>

    <section style="margin-bottom: 3rem">
      <h2>Progressive Enhancement</h2>
      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Native Hydration (Pre-filled via HTML)
        </label>
        <Select multiple placeholder="Select colors..." :hide-native="false">
          <optgroup label="Colors">
            <option value="red" selected>Red</option>
            <option value="green">Green</option>
            <option value="blue" selected>Blue</option>
          </optgroup>
        </Select>
        <div style="font-size: 11px; color: #666; margin-top: 8px">
          Notice: The Headless UI above is automatically populated and synchronized from the
          standard <code>&lt;option&gt;</code> tags defined in the slot.
        </div>
      </div>
    </section>

    <section style="margin-bottom: 3rem">
      <h2>Standard Selects</h2>

      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Basic Single Select
        </label>
        <Select
          :options="fruitOptions"
          :value="singleValue"
          placeholder="Pick a fruit"
          @change="(val) => (singleValue = val)"
        />
      </div>

      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Multiple Select with Groups
        </label>
        <Select
          multiple
          :options="groupedOptions"
          placeholder="Select food..."
          :value="multiValue"
          @change="(val) => (multiValue = val)"
        />
        <div
          style="
            margin-top: 1rem;
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 4px;
            border: 1px solid #eee;
            color: #333;
          "
        >
          <h4 style="margin: 0 0 0.5rem 0">Controlled State Management</h4>
          <p style="margin: 0 0 1rem 0; font-size: 13px; color: #666">
            Current multi-select value: <code>{{ JSON.stringify(multiValue) }}</code>
          </p>
          <button
            @click="multiValue = ['apple', 'carrot']"
            style="padding: 4px 12px; cursor: pointer"
          >
            Force Set to [Apple, Carrot]
          </button>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Searchable & Creatable (Native Hidden)
        </label>
        <Select
          searchable
          creatable
          hide-native
          :options="[
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
            { value: 'svelte', label: 'Svelte' },
          ]"
          placeholder="Framework..."
        />
        <div style="font-size: 11px; color: #666; margin-top: 8px">
          Notice: The native <code>&lt;select&gt;</code> is present in the DOM but visually hidden
          (using <code>hideNative</code>). Synchronization and validation still work perfectly in
          the background.
        </div>
      </div>

      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Remote Loading (Async)
        </label>
        <Select
          searchable
          cache-options
          :fetch-remote-options="fetchRemoteOptions"
          :on-fetch-error="(error) => console.error('Failed to load remote options:', error)"
          placeholder="Search users..."
        />
      </div>
    </section>

    <section style="margin-bottom: 3rem">
      <h2>Performance</h2>
      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Virtualized Select (10,000 items)
        </label>
        <Select virtualize :options="largeList" placeholder="Scroll 10,000 items..." />
      </div>
    </section>

    <section style="margin-bottom: 3rem">
      <h2>Core Engine</h2>
      <div style="margin-bottom: 1.5rem">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold">
          Pure Headless (No Native Element)
        </label>
        <Select
          :show-native="false"
          :options="[
            { value: 'logic', label: 'Logic Only' },
            { value: 'state', label: 'State Management' },
            { value: 'headless', label: 'No DOM Sync' },
          ]"
          placeholder="Select engine mode..."
        />
        <div style="font-size: 11px; color: #666; margin-top: 8px">
          Notice: There is no native <code>&lt;select&gt;</code> element here. The library is
          operating as a standalone logic engine.
        </div>
      </div>
    </section>
  </div>
</template>
