import $ from 'jquery';
import { useSelect } from '@verbpatch/headless-select';
import './index.css';

// ── Shared data ────────────────────────────────────────────────────────────
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

// ── Helper: mount a headless select into a pre-built DOM container ──────────
function mountSelect(
  containerId: string,
  config: Parameters<typeof useSelect>[0],
  opts: {
    multiple?: boolean;
    virtualize?: boolean;
    itemHeight?: number;
    containerHeight?: number;
  } = {}
) {
  const { virtualize = false, itemHeight = 35, containerHeight = 300 } = opts;

  const $container = $(`#${containerId}`);
  const $trigger = $container.find('.js-trigger');
  const $dropdown = $container.find('.js-dropdown');
  const $listbox = $container.find('.js-listbox');
  const $search = $container.find('.js-search');
  const $native = $container.find('.js-native');
  const $badge = $container.find('.js-badge');

  let renderCount = 0;

  const instance = useSelect(config);

  // Wire up native select if present.
  // The core already listens internally (debounced) via hydrateFrom, so we only
  // call setConfig to hand it the element — no extra jQuery change handler needed
  // (a redundant per-item selectOption/deselectOption loop would trigger N renders).
  if ($native.length) {
    instance.setConfig({ hydrateFrom: $native[0] as HTMLSelectElement });
  }

  // Wire up trigger
  $trigger.on('click', () => instance.toggle());
  $trigger.on('keydown', (e) => instance.handleKeyDown(e.originalEvent as KeyboardEvent));

  // Wire up search
  if ($search.length) {
    $search.on('input', (e) => instance.setSearch((e.target as HTMLInputElement).value));
    $search.on('keydown', (e) => instance.handleKeyDown(e.originalEvent as KeyboardEvent));
  }

  // Scroll guard for virtualized lists
  let isScrolling = false;
  let scrollTimer: ReturnType<typeof setTimeout>;

  if (virtualize) {
    $listbox.on('scroll', (e) => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
      instance.onScroll((e.target as HTMLElement).scrollTop);
    });
  }

  // ── Render function ────────────────────────────────────────────────────
  function render() {
    renderCount++;
    $badge.text(`Render Count: ${renderCount}`);

    const state = instance.getState();

    // Show/hide dropdown
    if (state.isOpen) {
      $dropdown.show();
      if ($search.length) {
        $search.val(state.search);
        setTimeout(() => $search.trigger('focus'), 0);
      }
    } else {
      $dropdown.hide();
    }

    // Update trigger label
    if (state.selectedValues.length > 0) {
      if (config.multiple) {
        const selectedOpts = instance.getSelectedOptions();
        const pills = selectedOpts.map((opt) => {
          const $clear = $('<span>')
            .addClass('selected-value-clear')
            .text('×')
            .on('click', (e) => {
              e.stopPropagation();
              instance.deselectOption(opt.value);
            });
          return $('<span>').addClass('selected-value-pill').text(opt.label).append($clear);
        });
        const $pillContainer = $('<div>').addClass('selected-values-container');
        pills.forEach((p) => $pillContainer.append(p));
        $trigger.empty().append($pillContainer);
      } else {
        $trigger.text(instance.getOptionLabel(state.selectedValues[0]));
      }
    } else {
      $trigger.text((config.placeholder as string) || 'Select...');
    }

    // Render options
    $listbox.empty();

    if (state.isLoading) {
      $listbox.append($('<div>').addClass('loading-state').text('Loading...'));
      return;
    }

    if (virtualize && state.virtualization) {
      // Virtualized rendering
      const $scroller = $('<div>').css({
        height: `${state.virtualization.totalHeight}px`,
        width: '100%',
        position: 'relative',
      });

      state.visibleOptions
        .slice(state.virtualization.startIndex, state.virtualization.endIndex)
        .forEach((option, idx) => {
          const actualIndex = state.virtualization!.startIndex + idx;
          const $opt = buildOptionEl(option, instance, {
            position: 'absolute',
            top: `${actualIndex * itemHeight}px`,
            height: `${itemHeight}px`,
            width: '100%',
            boxSizing: 'border-box',
          }, isScrolling);
          $scroller.append($opt);
        });

      $listbox.append($scroller);
    } else {
      // Standard rendering
      state.visibleOptions.forEach((option) => {
        $listbox.append(buildOptionEl(option, instance, {}, isScrolling));
      });
    }

    // Create option
    if (state.canCreate) {
      const createProps = instance.getCreateOptionProps();
      const $create = $('<div>')
        .addClass('create-option')
        .text(`+ Create "${state.search}"`)
        .on('click', createProps?.onClick);
      $listbox.append($create);
    }

    // Empty state
    if (state.visibleOptions.length === 0 && !state.canCreate) {
      $listbox.append($('<div>').addClass('empty-state').text('No results found'));
    }

    // Sync native select options (for prop-driven selects)
    if ($native.length) {
      const nativeEl = $native[0] as HTMLSelectElement;
      // Rebuild options if needed
      if (nativeEl.options.length !== state.resolvedOptions.length) {
        $native.empty();
        state.resolvedOptions.forEach((opt) => {
          const $opt = $('<option>').val(opt.value).text(opt.label);
          if (opt.disabled) $opt.prop('disabled', true);
          $native.append($opt);
        });
      }
      // Sync selection
      const selected = new Set(state.selectedValues);
      Array.from(nativeEl.options).forEach((opt) => {
        opt.selected = selected.has(opt.value);
      });
    }
  }

  instance.subscribe(render);
  render(); // Initial render

  return instance;
}

// ── Helper: build a single option element ──────────────────────────────────
function buildOptionEl(
  option: any,
  instance: ReturnType<typeof useSelect>,
  style: Record<string, string | number> = {},
  isScrolling = false
) {
  const optProps = instance.getOptionProps(option.value);
  const isFocused = optProps['data-focused'];
  const isSelected = optProps['aria-selected'];

  const classes = [
    'option-item',
    isFocused ? 'focused' : '',
    isSelected ? 'selected' : '',
    option.disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const $icon = $('<span>').addClass('option-icon').text(isSelected ? '●' : '○');
  const $label = $('<span>').text(option.label);
  const $labelWrap = $('<div>').addClass('option-label-container').append($label);

  if (option.groupLabel) {
    $labelWrap.append($('<span>').addClass('option-group-label').text(option.groupLabel));
  }

  const $opt = $('<div>')
    .attr({ id: optProps.id, role: optProps.role })
    .attr('aria-selected', String(isSelected))
    .addClass(classes)
    .css(style as any)
    .append($icon, $labelWrap);

  if (isFocused) {
    $opt.append($('<span>').addClass('option-focus-badge').text('[FOCUS]'));
  }

  $opt.on('click', (e) => {
    e.preventDefault();
    if (!optProps['aria-disabled']) optProps.onClick(e as any);
  });

  if (!isScrolling) {
    $opt.on('mouseenter', () => {
      if (!optProps['aria-disabled']) optProps.onMouseEnter();
    });
  }

  return $opt;
}

// ── Mount all examples ─────────────────────────────────────────────────────
$(function () {

  // 1. Native Hydration — progressive enhancement via <option> children
  const $hydrationNative = $('#select-hydration .native-select');
  // Pass hydrateFrom directly in initial config so the core reads pre-selected
  // <option selected> tags before any subscriber is registered.
  const hydrationInstance = useSelect({
    multiple: true,
    hydrateFrom: $hydrationNative[0] as HTMLSelectElement,
  });

  const $hydTrigger = $('#select-hydration .js-trigger');
  const $hydDropdown = $('#select-hydration .js-dropdown');
  const $hydListbox = $('#select-hydration .js-listbox');
  const $hydBadge = $('#select-hydration .js-badge');
  let hydRenderCount = 0;

  // No jQuery change handler here — the core's internal debounced listener
  // (registered via hydrateFrom) already handles native → headless sync.

  $hydTrigger.on('click', () => hydrationInstance.toggle());

  function renderHydration(state: ReturnType<typeof hydrationInstance.getState>) {
    hydRenderCount++;
    $hydBadge.text(`Render Count: ${hydRenderCount}`);

    if (state.isOpen) $hydDropdown.show(); else $hydDropdown.hide();

    if (state.selectedValues.length > 0) {
      const pills = instance_getSelectedOptions(hydrationInstance, state).map((opt: { value: string; label: string }) => {
        const $clear = $('<span>').addClass('selected-value-clear').text('×')
          .on('click', (e) => { e.stopPropagation(); hydrationInstance.deselectOption(opt.value); });
        return $('<span>').addClass('selected-value-pill').text(opt.label).append($clear);
      });
      const $pc = $('<div>').addClass('selected-values-container');
      pills.forEach((p: JQuery<HTMLElement>) => $pc.append(p));
      $hydTrigger.empty().append($pc);
    } else {
      $hydTrigger.text('Select colors...');
    }

    $hydListbox.empty();
    state.visibleOptions.forEach((opt) => {
      $hydListbox.append(buildOptionEl(opt, hydrationInstance));
    });

    // Sync native
    const nativeEl = $hydrationNative[0] as HTMLSelectElement;
    const selected = new Set(state.selectedValues);
    Array.from(nativeEl.options).forEach((o) => { o.selected = selected.has(o.value); });
  }

  hydrationInstance.subscribe(renderHydration);
  // Initial render — show pre-selected values immediately on page load.
  renderHydration(hydrationInstance.getState());

  // 2. Basic Single Select
  let singleValue = 'banana';
  const singleInstance = mountSelect('select-single', {
    options: fruitOptions,
    value: singleValue,
    placeholder: 'Pick a fruit',
    searchable: true,
    onChange: (val) => {
      singleValue = val as string;
      singleInstance.setConfig({ value: singleValue });
    },
  });

  // 3. Multiple Select with Groups
  let multiValue = ['apple', 'banana'];
  const multiInstance = mountSelect('select-multi', {
    options: groupedOptions,
    multiple: true,
    value: multiValue,
    placeholder: 'Select food...',
    searchable: true,
    onChange: (val) => {
      multiValue = val as string[];
      multiInstance.setConfig({ value: multiValue });
      $('#multi-value-display').text(JSON.stringify(multiValue));
    },
  }, { multiple: true });

  // Expose force-set globally for the inline onclick button
  (window as any).forceSetMulti = () => {
    multiValue = ['apple', 'carrot'];
    multiInstance.setConfig({ value: multiValue });
    $('#multi-value-display').text(JSON.stringify(multiValue));
  };

  // 4. Searchable & Creatable
  mountSelect('select-creatable', {
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
    ],
    searchable: true,
    creatable: true,
    placeholder: 'Framework...',
  });

  // 5. Remote Loading
  mountSelect('select-remote', {
    searchable: true,
    cacheOptions: true,
    placeholder: 'Search users...',
    fetchRemoteOptions: async (search: string) => {
      if (!search) return [];
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await res.json();
      return users
        .filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()))
        .map((u: any) => ({ value: String(u.id), label: u.name }));
    },
  });

  // 6. Virtualized (10,000 items)
  mountSelect('select-virtual', {
    options: largeList,
    searchable: true,
    virtualize: true,
    itemHeight: 35,
    containerHeight: 300,
    placeholder: 'Scroll 10,000 items...',
  }, { virtualize: true });

  // 7. Pure Headless
  mountSelect('select-headless', {
    options: [
      { value: 'logic', label: 'Logic Only' },
      { value: 'state', label: 'State Management' },
      { value: 'headless', label: 'No DOM Sync' },
    ],
    placeholder: 'Select engine mode...',
  });
});

// Small helper to get selected options from an instance + state snapshot
function instance_getSelectedOptions(
  _instance: ReturnType<typeof useSelect>,
  state: any
): Array<{ value: string; label: string }> {
  return (state.resolvedOptions as Array<{ value: string; label: string }>).filter(
    (o) => (state.selectedValues as string[]).includes(o.value)
  );
}
