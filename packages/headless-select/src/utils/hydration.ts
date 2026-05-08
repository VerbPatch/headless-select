import { DataItem } from '../core/types.js';

/**
 * Hydrates options and values from a native <select> element.
 * Supports <optgroup> and maintains the tree structure.
 */
export function hydrateFromElement(element: HTMLSelectElement): {
  options: DataItem[];
  selectedValues: string[];
  multiple: boolean;
} {
  const items: DataItem[] = [];

  Array.from(element.children).forEach((child) => {
    if (child instanceof HTMLOptGroupElement) {
      items.push({
        label: child.label,
        options: Array.from(child.getElementsByTagName('option')).map((opt) => ({
          value: opt.value,
          label: opt.text,
          disabled: opt.disabled,
        })),
        disabled: child.disabled,
      });
    } else if (child instanceof HTMLOptionElement) {
      items.push({
        value: child.value,
        label: child.text,
        disabled: child.disabled,
      });
    }
  });

  const selectedValues = Array.from(element.selectedOptions).map((opt) => opt.value);

  return {
    options: items,
    selectedValues,
    multiple: element.multiple,
  };
}
