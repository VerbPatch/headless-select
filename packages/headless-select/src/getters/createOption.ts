import type { SelectContext, SelectActions } from '@/core/context';

export function getCreateOptionProps(ctx: SelectContext, actions: SelectActions) {
  const state = ctx.getState();
  const config = ctx.getConfig();

  if (!state.canCreate) return null;

  return {
    onClick: () => actions.createOption(state.search),
    role: 'button',
    'aria-label': config.createOptionLabel ? config.createOptionLabel(state.search) : `Create "${state.search}"`,
  };
}
