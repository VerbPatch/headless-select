import { DataItem, SelectOption, isGroup, SelectConfig } from '../core/types';

/**
 * Flattens a list of options that may contain groups into a single flat array.
 * @group utilities
 * @title flattenOptions
 * @description Processes a mixed array of options and groups, injecting group metadata and inheriting disabled states.
 * @param {DataItem[]} items - The array of options or groups to flatten.
 * @returns {SelectOption[]} - A flat array of SelectOption objects.
 */
export function flattenOptions(items: DataItem[]): SelectOption[] {
  const result: SelectOption[] = [];
  for (const item of items) {
    if (isGroup(item)) {
      for (const o of item.options) {
        result.push({
          ...o,
          groupLabel: item.label,
          disabled: o.disabled || item.disabled,
        });
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * The default filtering logic used when no custom filter is provided.
 * @group utilities
 * @title defaultFilterOption
 * @description Performs a case-insensitive search against both the label and value of an option.
 * @param {SelectOption} option - The option to test.
 * @param {string} search - The search term to match against.
 * @returns {boolean} - True if the option matches the search term.
 */
export function defaultFilterOption(option: SelectOption, search: string): boolean {
  const lowSearch = search.toLowerCase();
  return (
    option.label.toLowerCase().includes(lowSearch) || option.value.toLowerCase().includes(lowSearch)
  );
}

/**
 * Filters a flat list of options based on a search term and filter function.
 * @group utilities
 * @title filterOptions
 * @description Orchestrates the filtering process for a list of options.
 * @param {SelectOption[]} options - The flat list of options to filter.
 * @param {string} search - The current search term.
 * @param {Function} filterFn - The function used to test each option.
 * @param {string[]} _selectedValues - Current selected values (reserved for future use).
 * @param {boolean} _multiple - Whether multiple selection is enabled (reserved for future use).
 * @returns {SelectOption[]} - The filtered list of options.
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
 * Merges new options into an existing array while preventing duplicate values.
 * @group utilities
 * @title mergeOptions
 * @description Combines two sets of options, ensuring that values already present in the existing set are not duplicated.
 * @param {SelectOption[]} existing - The current set of options.
 * @param {SelectOption[]} incoming - The new options to be merged.
 * @returns {SelectOption[]} - The combined unique set of options.
 */
export function mergeOptions(existing: SelectOption[], incoming: SelectOption[]): SelectOption[] {
  const existingValues = new Set(existing.map((o) => o.value));
  const uniqueIncoming = incoming.filter((o) => !existingValues.has(o.value));
  return [...existing, ...uniqueIncoming];
}

/**
 * Computes the final set of visible options based on the current configuration and state.
 * @group utilities
 * @title computeVisibleOptions
 * @description A high-level utility that resolves the filter function and applies it to the current options.
 * @param {SelectConfig} config - The select configuration.
 * @param {SelectOption[]} resolved - The full set of resolved options.
 * @param {string} search - The current search term.
 * @param {string[]} selectedValues - The currently selected values.
 * @returns {SelectOption[]} - The options that should be visible in the dropdown.
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
 * Determines if a new custom option can be created based on the current search input.
 * @group utilities
 * @title computeCanCreate
 * @description Validates the search term against existing options and configuration rules to decide if creation is allowed.
 * @param {SelectConfig} config - The select configuration.
 * @param {string} search - The current search term.
 * @param {SelectOption[]} resolved - The current set of resolved options.
 * @returns {boolean} - True if a new option can be created.
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
 * Calculates the next or previous focusable index in the options list.
 * @group utilities
 * @title nextFocusableIndex
 * @description Navigates through the options list to find the next available option that is not disabled, supporting circular wrapping.
 * @param {SelectOption[]} options - The list of options to navigate.
 * @param {string | null} currentValue - The value of the currently focused option.
 * @param {1 | -1} direction - The direction to move (1 for next, -1 for previous).
 * @returns {string | null} - The value of the next focusable option.
 */
export function nextFocusableIndex(
  options: SelectOption[],
  currentValue: string | null,
  direction: 1 | -1,
): string | null {
  if (options.length === 0) return null;

  const currentIndex = options.findIndex((o) => o.value === currentValue);
  let nextIndex = currentIndex + direction;

  if (currentIndex === -1) {
    nextIndex = direction === 1 ? 0 : options.length - 1;
  }

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
