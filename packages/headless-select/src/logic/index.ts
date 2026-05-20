import { createBaseActions } from '@/logic/base';
import { createSelectionActions } from '@/logic/selection';
import { createSearchActions } from '@/logic/search';
import { createCreatableActions } from '@/logic/creatable';
import type { SelectContext, SelectActions } from '@/core/context';
import type { OptionsCache } from '@/core/cache';

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
