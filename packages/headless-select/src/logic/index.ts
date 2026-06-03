import { createBaseActions } from '@/logic/base';
import { createSelectionActions } from '@/logic/selection';
import { createSearchActions } from '@/logic/search';
import { createCreatableActions } from '@/logic/creatable';
import type { SelectContext, SelectActions } from '@/core/context';
import type { OptionsCache } from '@/core/cache';

/**
 * Orchestrates all internal business logic and state transitions.
 * @ignore
 * @title createActions
 * @description Bundles base lifecycle, selection, search, and creation logic into a unified actions object.
 * @param {SelectContext} ctx - The internal select context.
 * @param {OptionsCache} cache - The asynchronous options cache.
 * @returns {SelectActions} - The combined actions object.
 */
export function createActions(ctx: SelectContext, cache: OptionsCache): SelectActions {
  const searchActions = createSearchActions(ctx, cache);
  const baseActions = createBaseActions(ctx, searchActions.runRemoteOptions);
  const selectionActions = createSelectionActions(ctx);
  const creatableActions = createCreatableActions(ctx);

  return {
    ...baseActions,
    ...selectionActions,
    ...searchActions,
    ...creatableActions,
    destroy: () => {
      searchActions.debouncedRemoteFetch.cancel();
    },
  };
}
