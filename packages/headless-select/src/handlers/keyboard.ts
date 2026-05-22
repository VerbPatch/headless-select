import type { SelectContext, SelectActions } from '@/core/context';
import { updateLastKeyboardEventTime } from '@/utils/common';

/**
 * Factory for the central keyboard event handler.
 * @group handlers
 * @title createKeyboardHandler
 * @description Manages all keyboard interactions, including navigation (arrows, home/end), selection (enter, space), and type-ahead searching.
 * @param {SelectContext} ctx - The internal select context.
 * @param {SelectActions} actions - Core instance actions.
 * @param {FocusActions} focus - Focus-specific actions.
 * @returns {KeyboardHandler} - Object containing the handleKeyDown method.
 */
export function createKeyboardHandler(
  ctx: SelectContext,
  actions: SelectActions,
  focus: {
    focusNext: () => void;
    focusPrev: () => void;
    focusFirst: () => void;
    focusLast: () => void;
    focusOption: (value: string | null) => void;
  },
) {
  let typeAheadQuery = '';
  let typeAheadTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Processes keyboard events for the select component.
   * @param {KeyboardEvent} e - The native keyboard event.
   */
  function handleKeyDown(e: KeyboardEvent): void {
    const config = ctx.getConfig();
    const state = ctx.getState();

    if (config.disabled) return;

    // Handle Type-ahead when dropdown is open and not searching
    if (state.isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // If searchable and focusing search input, don't type-ahead
      const isSearchFocused = document.activeElement?.getAttribute('role') === 'searchbox';
      if (!isSearchFocused || !(config.searchable ?? true)) {
        if (typeAheadTimer) clearTimeout(typeAheadTimer);
        typeAheadQuery += e.key.toLowerCase();
        typeAheadTimer = setTimeout(() => {
          typeAheadQuery = '';
        }, 500);

        const match = state.visibleOptions.find(
          (o) => !o.disabled && o.label.toLowerCase().startsWith(typeAheadQuery),
        );
        if (match) {
          focus.focusOption(match.value);
        }
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!state.isOpen) {
          actions.open();
        } else {
          focus.focusNext();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!state.isOpen) {
          actions.open();
        } else {
          focus.focusPrev();
        }
        break;

      case 'Home':
        e.preventDefault();
        if (state.isOpen) focus.focusFirst();
        break;

      case 'End':
        e.preventDefault();
        if (state.isOpen) focus.focusLast();
        break;

      case 'Enter': {
        e.preventDefault();
        if (!state.isOpen) {
          actions.open();
          break;
        }
        const focused = state.focusedOptionValue;
        if (focused !== null) {
          actions.toggleOption(focused);
        } else if (state.canCreate && state.search) {
          actions.createOption(state.search);
        }
        break;
      }

      case ' ': {
        if (config.searchable === false) {
          e.preventDefault();
          if (!state.isOpen) {
            actions.open();
          } else if (state.focusedOptionValue) {
            actions.toggleOption(state.focusedOptionValue);
          }
        }
        break;
      }

      case 'Escape':
        e.preventDefault();
        if (state.isOpen) {
          actions.close();
        }
        break;

      case 'Tab':
        if (state.isOpen) actions.close();
        break;

      case 'Backspace':
        if (config.multiple && state.search === '' && state.selectedValues.length > 0) {
          const last = state.selectedValues[state.selectedValues.length - 1];
          if (last !== undefined) actions.deselectOption(last);
        }
        break;

      case 'PageUp':
        e.preventDefault();
        if (state.isOpen) focus.focusFirst();
        break;

      case 'PageDown':
        e.preventDefault();
        if (state.isOpen) focus.focusLast();
        break;
    }
  }

  return { handleKeyDown };
}
