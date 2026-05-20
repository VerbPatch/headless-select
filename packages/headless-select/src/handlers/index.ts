import { createFocusActions } from '@/handlers/focus';
import { createKeyboardHandler } from '@/handlers/keyboard';
import type { SelectContext, SelectActions, KeyboardActions } from '@/core/context';

export function createHandlers(ctx: SelectContext, actions: SelectActions): KeyboardActions {
  const focusActions = createFocusActions(ctx);
  const keyboardHandler = createKeyboardHandler(ctx, actions, focusActions);

  return {
    ...focusActions,
    ...keyboardHandler,
  };
}
