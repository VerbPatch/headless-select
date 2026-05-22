/**
 * Represents the calculated position for the dropdown menu.
 * @group types
 * @title Position
 * @description Holds the coordinates and placement direction for a positioned element.
 */
export interface Position {
  /**
   * Vertical coordinate in pixels.
   */
  top: number;
  /**
   * Horizontal coordinate in pixels.
   */
  left: number;
  /**
   * Width of the element in pixels.
   */
  width: number;
  /**
   * Whether the menu is placed above or below the trigger.
   */
  placement: 'top' | 'bottom';
}

/**
 * Calculates the optimal position for the dropdown menu relative to its trigger.
 * @group utilities
 * @title calculatePosition
 * @description Computes top, left, and width while handling viewport collisions and flipping placement if space is restricted.
 * @param {HTMLElement} trigger - The reference element (trigger).
 * @param {HTMLElement} menu - The element to be positioned (dropdown).
 * @param {Object} [options] - Configuration for placement, strategy, and offset.
 * @returns {Position} - The calculated position and placement metadata.
 */
export function calculatePosition(
  trigger: HTMLElement,
  menu: HTMLElement,
  options: {
    placement?: 'top' | 'bottom';
    strategy?: 'absolute' | 'fixed';
    offset?: number;
  } = {},
): Position {
  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const strategy = options.strategy || 'absolute';
  const offset = options.offset || 4;

  let placement = options.placement || 'bottom';

  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  if (placement === 'bottom' && spaceBelow < menuRect.height && spaceAbove > spaceBelow) {
    placement = 'top';
  } else if (placement === 'top' && spaceAbove < menuRect.height && spaceBelow > spaceAbove) {
    placement = 'bottom';
  }

  const scrollX = strategy === 'absolute' ? window.scrollX : 0;
  const scrollY = strategy === 'absolute' ? window.scrollY : 0;

  let left = triggerRect.left + scrollX;
  if (left + menuRect.width > viewportWidth + scrollX) {
    left = viewportWidth + scrollX - menuRect.width - offset;
  }
  left = Math.max(offset, left);

  let top: number;
  if (placement === 'bottom') {
    top = triggerRect.bottom + scrollY + offset;
  } else {
    top = triggerRect.top + scrollY - menuRect.height - offset;
  }

  return {
    top,
    left,
    width: triggerRect.width,
    placement,
  };
}
