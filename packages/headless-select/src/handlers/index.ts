import { createFocusActions } from './focus.js';
import { createKeyboardHandler } from './keyboard.js';
import type { SelectContext, SelectActions, KeyboardActions } from '../core/context.js';

export function createHandlers(ctx: SelectContext, actions: SelectActions): KeyboardActions {
  const focusActions = createFocusActions(ctx);
  const keyboardHandler = createKeyboardHandler(ctx, actions, focusActions);

  return {
    ...focusActions,
    ...keyboardHandler,
  };
}
