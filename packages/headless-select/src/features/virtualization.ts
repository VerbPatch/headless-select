export interface VirtualizationState {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  items: { index: number; top: number }[];
}

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

  const items = [];
  for (let i = startIndex; i < endIndex; i++) {
    items.push({
      index: i,
      top: i * itemHeight,
    });
  }

  return {
    startIndex,
    endIndex,
    totalHeight: itemCount * itemHeight,
    offsetY: startIndex * itemHeight,
    items,
  };
}
