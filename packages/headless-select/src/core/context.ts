import type { SelectState, SelectConfig, SelectChange } from '@/core/types';

/**
 * Provides access to the core engine's internal state and configuration.
 * Passed to all modular sub-systems (actions, keyboard, getters).
 */
export interface SelectContext {
  getState: () => SelectState;
  setState: (patch: Partial<SelectState>, change?: SelectChange) => void;
  getConfig: () => SelectConfig;
  instanceId: string;
  listboxId: string;
}

/**
 * Core business logic actions for the select instance.
 */
export interface SelectActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectOption: (value: string) => void;
  deselectOption: (value: string) => void;
  toggleOption: (value: string) => void;
  clearAll: () => void;
  setSearch: (term: string) => void;
  createOption: (input: string) => void;
  runLoadOptions: (search: string) => Promise<void>;
  destroy: () => void;
}

/**
 * Keyboard navigation and focus management actions.
 */
export interface KeyboardActions {
  handleKeyDown: (e: KeyboardEvent) => void;
  focusOption: (value: string | null) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
}
