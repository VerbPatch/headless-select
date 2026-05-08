import { createBaseActions } from './base.js';
import { createSelectionActions } from './selection.js';
import { createSearchActions } from './search.js';
import { createCreatableActions } from './creatable.js';
import type { SelectContext, SelectActions } from '../core/context.js';
import type { OptionsCache } from '../core/cache.js';

export function createActions(ctx: SelectContext, cache: OptionsCache): SelectActions {
  const searchActions = createSearchActions(ctx, cache);
  const baseActions = createBaseActions(ctx, searchActions.runLoadOptions);
  const selectionActions = createSelectionActions(ctx);
  const creatableActions = createCreatableActions(ctx);

  return {
    ...baseActions,
    ...selectionActions,
    ...searchActions,
    ...creatableActions,
    destroy: () => {
      searchActions.debouncedLoad.cancel();
    },
  };
}
