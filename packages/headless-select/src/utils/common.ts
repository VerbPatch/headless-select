/**
 * Generates a unique ID with a prefix.
 */
export function uid(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a stable ID for an option based on instance ID and value.
 */
export function getOptionId(instanceId: string, value: string): string {
  return `${instanceId}-opt-${value.replace(/[^a-z0-9]/gi, '_')}`;
}

/**
 * Debounce utility.
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
 * Scroll an element into view within its container.
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
