import { SelectState, SelectChange, SelectConfig } from './types';

/**
 * Provides access to the core engine's internal state and configuration.
 * @group core
 * @title SelectContext
 * @description The internal shared context passed to all modular sub-systems (actions, keyboard, getters).
 */
export interface SelectContext {
  /**
   * Returns the current internal state.
   */
  getState: () => SelectState;
  /**
   * Updates the internal state and optionally emits a change event.
   */
  setState: (patch: Partial<SelectState>, change?: SelectChange) => void;
  /**
   * Returns the current configuration.
   */
  getConfig: () => SelectConfig;
  /**
   * Unique identifier for this select instance.
   */
  instanceId: string;
  /**
   * Unique identifier for the listbox element.
   */
  listboxId: string;
}

/**
 * Core business logic actions for the select instance.
 * @group core
 * @title SelectActions
 * @description Defines the set of imperative actions available to manipulate the select state.
 */
export interface SelectActions {
  /** Opens the dropdown menu. */
  open: () => void;
  /** Closes the dropdown menu. */
  close: () => void;
  /** Toggles the dropdown menu open or closed. */
  toggle: () => void;
  /** Selects an option by value. */
  selectOption: (value: string) => void;
  /** Deselects an option by value. */
  deselectOption: (value: string) => void;
  /** Toggles selection state of an option. */
  toggleOption: (value: string) => void;
  /** Clears all selections. */
  clearAll: () => void;
  /** Sets the search term. */
  setSearch: (term: string) => void;
  /** Creates a new option. */
  createOption: (input: string) => void;
  /** Manually triggers an async load. */
  runRemoteOptions: (search: string) => Promise<void>;
  /** Cleans up the instance. */
  destroy: () => void;
}

/**
 * Keyboard navigation and focus management actions.
 * @ignore
 * @title KeyboardActions
 * @description Defines handlers and actions for keyboard-based interaction and focus control.
 */
export interface KeyboardActions {
  /** The main keydown event handler. */
  handleKeyDown: (e: KeyboardEvent) => void;
  /** Focuses an option by value. */
  focusOption: (value: string | null) => void;
  /** Focuses the next option. */
  focusNext: () => void;
  /** Focuses the previous option. */
  focusPrev: () => void;
  /** Focuses the first option. */
  focusFirst: () => void;
  /** Focuses the last option. */
  focusLast: () => void;
}
