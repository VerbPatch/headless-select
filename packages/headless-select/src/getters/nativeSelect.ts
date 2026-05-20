import type { SelectContext } from '@/core/context';

export function getNativeSelectProps(ctx: SelectContext) {
  const config = ctx.getConfig();
  return {
    multiple: config.multiple,
    disabled: config.disabled,
    'aria-hidden': true,
    tabIndex: -1,
    style: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
  };
}
