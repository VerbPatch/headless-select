import type { SelectContext } from '@/core/context';

/**
 * Generates props for a hidden native select element.
 * @group getters
 * @title getNativeSelectProps
 * @description Provides attributes and styles to keep a hidden native `<select>` in sync for form submissions and progressive enhancement.
 * @param {SelectContext} ctx - The internal select context.
 * @returns {Object} - Props for the native select element.
 */
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
