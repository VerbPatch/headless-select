import { DataItem } from '../core/types';

/**
 * Hydrates options and values from a native HTML select element.
 * @group utilities
 * @title hydrateFromElement
 * @description Scans a native `<select>` element for its options and `<optgroup>` children, extracting values, labels, and disabled states.
 * @param {HTMLSelectElement} element - The native select element to hydrate from.
 * @returns {Object} - An object containing the extracted options, selected values, and multiple-selection mode.
 */
export function hydrateFromElement(element: HTMLSelectElement): {
  options: DataItem[];
  selectedValues: string[];
  multiple: boolean;
} {
  const items: DataItem[] = [];
  const selectedValues: Set<string> = new Set();

  Array.from(element.children).forEach((child) => {
    if (child instanceof HTMLOptGroupElement) {
      items.push({
        label: child.label,
        options: Array.from(child.getElementsByTagName('option')).map((opt) => {
          if (opt.hasAttribute('selected') || opt.selected) {
            selectedValues.add(opt.value);
          }
          return {
            value: opt.value,
            label: opt.text,
            disabled: opt.disabled,
          };
        }),
        disabled: child.disabled,
      });
    } else if (child instanceof HTMLOptionElement) {
      if (child.hasAttribute('selected') || child.selected) {
        selectedValues.add(child.value);
      }
      items.push({
        value: child.value,
        label: child.text,
        disabled: child.disabled,
      });
    }
  });

  Array.from(element.selectedOptions).forEach((opt) => selectedValues.add(opt.value));
  return {
    options: items,
    selectedValues: Array.from(selectedValues),
    multiple: element.multiple,
  };
}
