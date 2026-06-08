import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSelect } from '../src/useSelect';
import { calculatePosition } from '../src/features/positioning';
import { calculateVirtualization } from '../src/features/virtualization';
import { debounce, scrollIntoView } from '../src/utils/common';

describe('useSelect - High Coverage', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ];

  let dummyEl: HTMLSelectElement;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    dummyEl = document.createElement('select');
    document.body.appendChild(dummyEl);
  });

  // ── Core & Lifecycle ────────────────────────────────────────────────────────

  it('initializes with grouped options and handle setConfig', () => {
    const grouped = [{ label: 'G', options: [{ value: 'a', label: 'A' }] }];
    const select = useSelect({ options: grouped, hydrateFrom: dummyEl });
    expect(select.getState().resolvedOptions).toHaveLength(1);

    select.setConfig({ multiple: true });
    expect(select.getState().visibleOptions).toHaveLength(1);

    // Test updating options via setConfig
    const newOptions = [
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
    ];
    select.setConfig({ options: newOptions });
    expect(select.getState().resolvedOptions).toHaveLength(2);
    expect(select.getState().resolvedOptions[0].value).toBe('b');
  });

  it('handles controlled and uncontrolled value', () => {
    const uncontrolled = useSelect({ options, defaultValue: 'apple', hydrateFrom: dummyEl });
    expect(uncontrolled.getState().selectedValues).toEqual(['apple']);

    const controlled = useSelect({ options, value: 'cherry', hydrateFrom: dummyEl });
    controlled.selectOption('apple');
    expect(controlled.getState().selectedValues).toEqual(['cherry']);
  });

  it('destroys correctly', () => {
    const select = useSelect({ options, hydrateFrom: dummyEl });
    select.destroy();
  });

  // ── Actions ─────────────────────────────────────────────────────────────────

  it('toggles open/close and handles disabled state', () => {
    const onOpen = vi.fn();
    const select = useSelect({ options, onOpen, hydrateFrom: dummyEl });
    select.open();
    expect(select.getState().isOpen).toBe(true);
    expect(onOpen).toHaveBeenCalled();
    select.close();
    expect(select.getState().isOpen).toBe(false);

    select.setConfig({ disabled: true });
    select.open();
    expect(select.getState().isOpen).toBe(false);
  });

  it('focuses first selected value when opening', () => {
    const select = useSelect({ options, value: 'cherry', hydrateFrom: dummyEl });
    select.open();
    expect(select.getState().focusedOptionValue).toBe('cherry');
  });

  it('handles selection, deselection and toggleOption', () => {
    const select = useSelect({ options, multiple: true, hydrateFrom: dummyEl });
    select.selectOption('apple');
    expect(select.getState().selectedValues).toEqual(['apple']);
    select.deselectOption('apple');
    expect(select.getState().selectedValues).toEqual([]);
    select.toggleOption('cherry');
    expect(select.getState().selectedValues).toEqual(['cherry']);

    select.clearAll();
    expect(select.getState().selectedValues).toEqual([]);
  });

  it('handles creatable options', () => {
    const select = useSelect({ options, creatable: true, hydrateFrom: dummyEl });
    select.setSearch('new');
    select.createOption('new');
    expect(select.getState().selectedValues).toEqual(['new']);
  });

  // ── Keyboard & Focus ────────────────────────────────────────────────────────

  it('navigates with keyboard and handles type-ahead', () => {
    const select = useSelect({ options, hydrateFrom: dummyEl });
    select.open();
    const props = select.getTriggerProps();

    props.onKeyDown({ key: 'ArrowDown', preventDefault: () => {} } as unknown as KeyboardEvent);
    expect(select.getState().focusedOptionValue).toBe('apple');

    props.onKeyDown({ key: 'End', preventDefault: () => {} } as unknown as KeyboardEvent);
    expect(select.getState().focusedOptionValue).toBe('cherry');

    props.onKeyDown({ key: 'c', length: 1, preventDefault: () => {} } as unknown as KeyboardEvent);
    expect(select.getState().focusedOptionValue).toBe('cherry');
  });

  it('selects with Enter', () => {
    const select = useSelect({ options, searchable: false, hydrateFrom: dummyEl });
    select.open();
    select.focusOption('cherry');
    select
      .getTriggerProps()
      .onKeyDown({ key: 'Enter', preventDefault: () => {} } as unknown as KeyboardEvent);
    expect(select.getState().selectedValues).toEqual(['cherry']);
  });

  // ── Async ───────────────────────────────────────────────────────────────────

  it('handles async loading and cache', async () => {
    const fetchRemoteOptions = vi.fn().mockResolvedValue([{ value: 'async', label: 'Async' }]);
    const select = useSelect({ fetchRemoteOptions, cacheOptions: true, hydrateFrom: dummyEl });
    select.setSearch('test');
    vi.runAllTimers();
    await vi.waitFor(() => expect(select.getState().isLoading).toBe(false));
    expect(select.getState().resolvedOptions.some((o) => o.value === 'async')).toBe(true);

    select.setSearch('');
    select.setSearch('test');
    vi.runAllTimers();
    expect(fetchRemoteOptions).toHaveBeenCalledTimes(1);
  });

  // ── Utils & Features ────────────────────────────────────────────────────────

  it('calculates position and virtualization correctly', () => {
    const trigger = {
      getBoundingClientRect: () => ({ top: 10, bottom: 20, left: 0, width: 100 }),
    } as unknown as HTMLElement;
    const menu = { getBoundingClientRect: () => ({ height: 50 }) } as unknown as HTMLElement;
    global.innerHeight = 100;
    expect(calculatePosition(trigger, menu).placement).toBe('bottom');

    const virt = calculateVirtualization(100, 20, 200, 0);
    expect(virt.startIndex).toBe(0);
    expect(virt.endIndex).toBe(20);
  });

  it('scrolls to focused item with virtualization', () => {
    const largeOptions = Array.from({ length: 100 }, (_, i) => ({
      value: `option-${i}`,
      label: `Option ${i}`,
    }));
    const select = useSelect({
      options: largeOptions,
      virtualize: true,
      itemHeight: 20,
      containerHeight: 100,
    });
    select.open();
    select.focusOption('option-50');

    const container = {
      scrollTop: 0,
    } as unknown as HTMLElement;

    select.scrollToFocused(container);
    // option-50 is at 50 * 20 = 1000px.
    // itemBottom = 1020px. containerHeight = 100.
    // scrollTop = 1020 - 100 = 920.
    expect(container.scrollTop).toBe(920);
  });

  it('debounces and scrolls into view', () => {
    const fn = vi.fn();
    const { call } = debounce(fn, 100);
    call();
    call();
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);

    const container = {
      getBoundingClientRect: () => ({ top: 0, bottom: 100 }),
      scrollTop: 0,
    } as unknown as HTMLElement;
    const element = {
      getBoundingClientRect: () => ({ top: 110, bottom: 120 }),
    } as unknown as HTMLElement;
    scrollIntoView(container, element);
    expect(container.scrollTop).toBeGreaterThan(0);
  });

  it('hydrates from element including multiple and optgroups', () => {
    const el = document.createElement('select');
    el.multiple = true;

    const group = document.createElement('optgroup');
    group.label = 'Fruits';
    group.appendChild(new Option('Apple', 'apple', false, true));
    el.appendChild(group);

    el.add(new Option('Banana', 'banana'));

    const select = useSelect({ hydrateFrom: el });
    const state = select.getState();

    expect(state.selectedValues).toEqual(['apple']);
    expect(state.resolvedOptions).toHaveLength(2);
    expect(state.resolvedOptions[0].groupLabel).toBe('Fruits');
    expect(select.getConfig().multiple).toBe(true);
  });

  it('preserves dynamically loaded options on setConfig when static options/hydrateFrom are unchanged', async () => {
    const fetchRemoteOptions = vi.fn().mockResolvedValue([{ value: 'async-1', label: 'Async 1' }]);
    const select = useSelect({ fetchRemoteOptions, options: [], hydrateFrom: dummyEl });

    select.setSearch('test');
    vi.runAllTimers();
    await vi.waitFor(() => expect(select.getState().isLoading).toBe(false));
    expect(select.getState().resolvedOptions).toHaveLength(1);
    expect(select.getState().resolvedOptions[0].value).toBe('async-1');

    // Call setConfig with same empty options array and same hydrateFrom element
    select.setConfig({ options: [], hydrateFrom: dummyEl });
    expect(select.getState().resolvedOptions).toHaveLength(1);
    expect(select.getState().resolvedOptions[0].value).toBe('async-1');
  });
});
