export interface Position {
  top: number;
  left: number;
  width: number;
  placement: 'top' | 'bottom';
}

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

  // Vertical boundary detection
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  if (placement === 'bottom' && spaceBelow < menuRect.height && spaceAbove > spaceBelow) {
    placement = 'top';
  } else if (placement === 'top' && spaceAbove < menuRect.height && spaceBelow > spaceAbove) {
    placement = 'bottom';
  }

  const scrollX = strategy === 'absolute' ? window.scrollX : 0;
  const scrollY = strategy === 'absolute' ? window.scrollY : 0;

  // Horizontal boundary detection
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
