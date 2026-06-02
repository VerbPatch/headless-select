/**
 * Generates a unique identifier with a given prefix.
 * @group utilities
 * @title uid
 * @description Creates a random string ID suitable for DOM elements or internal tracking.
 * @param {string} [prefix='id'] - The prefix for the generated ID.
 * @returns {string} - The generated unique ID.
 */
export function uid(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a stable and valid DOM ID for an option.
 * @group utilities
 * @title getOptionId
 * @description Creates an ID string based on the instance ID and option value, sanitizing special characters.
 * @param {string} instanceId - The ID of the select instance.
 * @param {string} value - The value of the option.
 * @returns {string} - A sanitized DOM ID string.
 */
export function getOptionId(instanceId: string, value: string): string {
  return `${instanceId}-opt-${value.replace(/[^a-z0-9]/gi, '_')}`;
}

/**
 * Creates a debounced version of a function.
 * @group utilities
 * @title debounce
 * @description Delays the execution of a function until after a specified period of inactivity.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Object} - An object with `call` and `cancel` methods.
 */
export function debounce<T extends Array<unknown>>(
  fn: (...args: T) => void,
  delay: number,
): { call: (...args: T) => void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return {
    call: (...args: T) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    },
    cancel: () => {
      if (timer) clearTimeout(timer);
    },
  };
}

/**
 * Ensures an element is visible within its scrollable container.
 * @group utilities
 * @title scrollIntoView
 * @description Adjusts the container's scroll position if the specified element is currently out of view.
 * @param {HTMLElement} container - The scrollable parent container.
 * @param {HTMLElement} element - The child element to bring into view.
 */
export function scrollIntoView(container: HTMLElement, element: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  if (elementRect.top < containerRect.top) {
    container.scrollTop -= containerRect.top - elementRect.top;
  } else if (elementRect.bottom > containerRect.bottom) {
    container.scrollTop += elementRect.bottom - containerRect.bottom;
  }
}
