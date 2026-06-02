/**
 * Represents the current state of the list virtualization.
 * @group types
 * @title VirtualizationState
 * @description Contains the range of items to render and their positioning within the scrollable container.
 */
export interface VirtualizationState {
  /**
   * Index of the first item to render.
   */
  startIndex: number;
  /**
   * Index of the last item to render (exclusive).
   */
  endIndex: number;
  /**
   * Total estimated height of the scrollable content.
   */
  totalHeight: number;
  /**
   * Vertical offset for the rendered items container.
   */
  offsetY: number;
}

/**
 * Calculates the virtualization window for a scrollable list.
 * @group utilities
 * @title calculateVirtualization
 * @description Determines which subset of items should be rendered based on scroll position and container height.
 * @param {number} itemCount - Total number of items in the list.
 * @param {number} itemHeight - Fixed height of a single item in pixels.
 * @param {number} containerHeight - Height of the visible scroll container in pixels.
 * @param {number} scrollTop - Current scroll top position of the container.
 * @param {number} [overscan=5] - Number of extra items to render outside the visible area.
 * @returns {VirtualizationState} - The calculated virtualization state.
 */
export function calculateVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan = 5,
): VirtualizationState {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(itemCount, startIndex + visibleCount + 2 * overscan);

  return {
    startIndex,
    endIndex,
    totalHeight: itemCount * itemHeight,
    offsetY: startIndex * itemHeight,
  };
}
