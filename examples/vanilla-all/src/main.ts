import {
  useSelect,
  SelectInstance,
  SelectConfig,
  SelectState,
  calculateVirtualization,
} from '@verbpatch/headless-select';

import { setupSelectUI } from './SelectUI';

// ── Global Native Button Handler ─────────────────────────────────────────────

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const getBtn = target.closest('.get-value-btn');
  if (getBtn) {
    const targetId = (getBtn as HTMLElement).dataset.for!;
    const selectEl = document.getElementById(targetId) as HTMLSelectElement;
    const displayEl = document.getElementById(`value-${targetId}`);
    if (selectEl && displayEl) {
      const values = Array.from(selectEl.selectedOptions).map((opt) => opt.value);
      displayEl.textContent = `Value: ${values.length > 0 ? JSON.stringify(values) : '(none)'}`;
    }
  }

  const setBtn = target.closest('.set-random-btn');
  if (setBtn) {
    const targetId = (setBtn as HTMLElement).dataset.for!;
    const selectEl = document.getElementById(targetId) as HTMLSelectElement;
    if (selectEl) {
      if (selectEl.multiple) {
        Array.from(selectEl.options).forEach((opt) => {
          if (Math.random() > 0.5) opt.selected = !opt.selected;
        });
      } else {
        const index = Math.floor(Math.random() * selectEl.options.length);
        if (selectEl.options[index]) selectEl.options[index].selected = true;
      }
      selectEl.dispatchEvent(new Event('change'));
    }
  }
});

// ── Initialization ───────────────────────────────────────────────────────────

setupSelectUI('anchor-minimal', {
  options: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ],
  placeholder: 'Pick a fruit',
});

setupSelectUI('anchor-multi', {
  multiple: true,
  options: [
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
  ],
  placeholder: 'Select food...',
});

setupSelectUI('anchor-remote', {
  searchable: true,
  cacheOptions: true,
  fetchRemoteOptions: async (search) => {
    if (!search) return [];
    const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const users = await res.json();
    return users
      .filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()))
      .map((u: any) => ({ value: String(u.id), label: u.name }));
  },
  placeholder: 'Search users...',
});

setupSelectUI('anchor-creatable', {
  creatable: true,
  multiple: true,
  options: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ],
  placeholder: 'Framework...',
});

setupSelectUI('anchor-hydration', {
  placeholder: 'Hydrated...',
});

const largeList = Array.from({ length: 10000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}));

setupSelectUI('anchor-virtual', {
  virtualize: true,
  itemHeight: 28,
  containerHeight: 200,
  options: largeList,
  placeholder: 'Scroll 1,000 items...',
});

setupSelectUI('anchor-sync-single', {
  placeholder: 'Sync Single...',
});

setupSelectUI('anchor-sync-multi', {
  multiple: true,
  placeholder: 'Sync Multiple...',
});
