import type { SelectContext, SelectActions } from '../core/context';

/**
 * Generates props for the "Create" option element.
 * @group getters
 * @title getCreateOptionProps
 * @description Provides the click handler and accessibility labels for the dynamic creation row.
 * @param {SelectContext} ctx - The internal select context.
 * @param {SelectActions} actions - Core instance actions.
 * @returns {Object | null} - Props for the create option element, or null if creation is not possible.
 */
export function getCreateOptionProps(ctx: SelectContext, actions: SelectActions) {
  const state = ctx.getState();
  const config = ctx.getConfig();

  if (!state.canCreate) return null;

  return {
    onClick: () => actions.createOption(state.search),
    role: 'button',
    'aria-label': config.createOptionLabel
      ? config.createOptionLabel(state.search)
      : `Create "${state.search}"`,
  };
}
