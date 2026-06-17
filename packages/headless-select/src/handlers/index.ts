import { SelectContext, SelectActions, KeyboardActions } from '../core/context';
import { createFocusActions } from './focus';
import { createKeyboardHandler } from './keyboard';

/**
 * Orchestrates all interaction and focus management handlers.
 * @ignore
 * @title createHandlers
 * @description Combines focus control logic and the master keyboard event handler into a unified object.
 * @param {SelectContext} ctx - The internal select context.
 * @param {SelectActions} actions - Core instance actions.
 * @returns {KeyboardActions} - The combined handlers object.
 */
export function createHandlers(ctx: SelectContext, actions: SelectActions): KeyboardActions {
  const focusActions = createFocusActions(ctx);
  const keyboardHandler = createKeyboardHandler(ctx, actions, focusActions);

  return {
    ...focusActions,
    ...keyboardHandler,
  };
}
