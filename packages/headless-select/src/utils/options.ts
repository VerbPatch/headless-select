import { DataItem, SelectOption, isGroup, SelectConfig } from '@/core/types';

/**
 * Flattens grouped options into a flat array of options.
 * Injects groupLabel into each option for UI rendering.
 */
export function flattenOptions(items: DataItem[]): SelectOption[] {
  return items.reduce((acc, item) => {
    if (isGroup(item)) {
      return [
        ...acc,
        ...item.options.map((o) => ({
          ...o,
          groupLabel: item.label,
          disabled: o.disabled || item.disabled,
        })),
      ];
    }
    return [...acc, item];
  }, [] as SelectOption[]);
}

/**
 * Default filter function.
 */
export function defaultFilterOption(option: SelectOption, search: string): boolean {
  const lowSearch = search.toLowerCase();
  return (
    option.label.toLowerCase().includes(lowSearch) || option.value.toLowerCase().includes(lowSearch)
  );
}

/**
 * Filters a flat list of options.
 */
export function filterOptions(
  options: SelectOption[],
  search: string,
  filterFn: (option: SelectOption, search: string) => boolean,
  _selectedValues: string[],
  _multiple: boolean,
): SelectOption[] {
  if (!search) return options;
  return options.filter((opt) => filterFn(opt, search));
}

/**
 * Merges new options into an existing pool without duplicates.
 */
export function mergeOptions(existing: SelectOption[], incoming: SelectOption[]): SelectOption[] {
  const existingValues = new Set(existing.map((o) => o.value));
  const uniqueIncoming = incoming.filter((o) => !existingValues.has(o.value));
  return [...existing, ...uniqueIncoming];
}

/**
 * Shared logic for computing visible options based on current state and config.
 */
export function computeVisibleOptions(
  config: SelectConfig,
  resolved: SelectOption[],
  search: string,
  selectedValues: string[],
): SelectOption[] {
  const filterFn = config.filterOption ?? defaultFilterOption;
  const multiple = config.multiple ?? false;
  return filterOptions(resolved, search, filterFn, selectedValues, multiple);
}

/**
 * Shared logic for determining if a new option can be created.
 */
export function computeCanCreate(
  config: SelectConfig,
  search: string,
  resolved: SelectOption[],
): boolean {
  if (!config.creatable) return false;
  const trimmed = search.trim();
  if (!trimmed) return false;
  const guard =
    config.isValidNewOption ??
    (() => {
      const exists = resolved.some((o) => o.label.toLowerCase() === trimmed.toLowerCase());
      return !exists;
    });
  return guard(trimmed, resolved);
}

/**
 * Calculates the next/previous focusable option value.
 * Skips disabled options and handles wrapping.
 */
export function nextFocusableIndex(
  options: SelectOption[],
  currentValue: string | null,
  direction: 1 | -1,
): string | null {
  if (options.length === 0) return null;

  const currentIndex = options.findIndex((o) => o.value === currentValue);
  let nextIndex = currentIndex + direction;

  // Handle initial focus or wrapping
  if (currentIndex === -1) {
    nextIndex = direction === 1 ? 0 : options.length - 1;
  }

  // Iterate to find non-disabled option
  for (let i = 0; i < options.length; i++) {
    const wrappedIndex = (nextIndex + options.length) % options.length;
    const opt = options[wrappedIndex];

    if (opt && !opt.disabled) {
      return opt.value;
    }

    nextIndex += direction;
  }

  return currentValue;
}
