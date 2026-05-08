// ─── Option & Group Types ────────────────────────────────────────────────────

export type SelectOption = {
  value: string; // machine value stored & emitted
  label: string; // human-readable display text
  disabled?: boolean; // greys out & blocks selection of this option
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any; // arbitrary metadata (select2-style), e.g. avatarUrl, subtitle
};

export type SelectGroup = {
  label: string; // group heading shown in the dropdown
  options: SelectOption[]; // options belonging to this group
  disabled?: boolean; // disables every option in the group at once
};

// Union used everywhere options are accepted — keeps API surface consistent
export type DataItem = SelectOption | SelectGroup;

// Discriminator helper — guards at runtime without an extra "type" field
export function isGroup(item: DataItem): item is SelectGroup {
  return 'options' in item;
}

// ─── Internal State ───────────────────────────────────────────────────────────

export interface SelectState {
  isOpen: boolean;
  search: string;
  selectedValues: string[];

  // All options after static config + async load + groups flattened.
  // Source of truth for lookups (value → label, etc.).
  resolvedOptions: SelectOption[];

  // Subset of resolvedOptions currently shown — post-search-filter.
  // Drives what the dropdown renders.
  visibleOptions: SelectOption[];

  // Tracks keyboard focus by value (not index) so it survives
  // re-filtering and group reordering without going stale.
  focusedOptionValue: string | null;

  // Derived: search.length > 0 && isValidNewOption(search) — controls
  // whether the "Create …" option is rendered.
  canCreate: boolean;

  isLoading: boolean;
  error: Error | null;
}

// ─── Change Metadata (emitted with onChange) ──────────────────────────────────

export type SelectChange = {
  type: 'select' | 'deselect' | 'clear' | 'create';
  // null on 'clear'
  option: SelectOption | null;
};

// ─── Main Config ──────────────────────────────────────────────────────────────

export interface SelectConfig {
  // ── Value control ─────────────────────────────────────────────────────

  // Controlled mode — parent owns the value, must update on onChange.
  value?: string | string[];

  // Uncontrolled mode — component owns state internally.
  defaultValue?: string | string[];

  // ── Data ──────────────────────────────────────────────────────────────

  // Static option list. Accepts flat options or grouped options (DataItem[]).
  options?: DataItem[];

  // Async loader — called with the current search string.
  // If omitted, filtering happens client-side against `options`.
  loadOptions?: (search: string) => Promise<SelectOption[]>;

  // true → call loadOptions on open (before user types).
  // SelectOption[] → pre-populate dropdown, still call loadOptions on search.
  defaultOptions?: boolean | SelectOption[];

  // Memoises loadOptions results keyed by search string.
  // Avoids duplicate network calls for the same query.
  cacheOptions?: boolean;

  // Hydrate initial options + selectedValues from an existing <select> element.
  // Useful for progressive enhancement of server-rendered forms.
  hydrateFrom: HTMLSelectElement;

  // ── Behaviour ─────────────────────────────────────────────────────────

  // Allow selecting more than one option at a time.
  multiple?: boolean;

  // Show a search input inside the dropdown. Default: true.
  searchable?: boolean;

  // Show a clear/reset button to deselect everything.
  clearable?: boolean;

  // Disables the entire control — no interaction, visually dimmed.
  disabled?: boolean;

  // Allow the user to create an option that doesn't exist in the list.
  creatable?: boolean;

  // Close dropdown after selecting an option.
  // Default: true for single, false for multiple.
  closeOnSelect?: boolean;

  // ── Search & filtering ────────────────────────────────────────────────

  // Custom client-side filter. Return true to keep the option.
  // Overrides default label-match filtering.
  filterOption?: (option: SelectOption, search: string) => boolean;

  // Debounce delay in ms before loadOptions is called. Default: 300.
  searchDelay?: number;

  // Minimum characters typed before search fires (select2 pattern).
  minSearchLength?: number;

  // ── Display ───────────────────────────────────────────────────────────

  // Ghost text shown when nothing is selected.
  placeholder?: string;

  // Text shown in the dropdown while loadOptions is in-flight.
  loadingMessage?: string;

  // Text (or factory) shown when filtering returns zero results.
  noOptionsMessage?: string | ((search: string) => string);

  // ── Creatable ─────────────────────────────────────────────────────────

  // Return true to allow creating an option with this input value.
  // Default: () => true (any non-empty input is valid).
  isValidNewOption?: (input: string, currentOptions: SelectOption[]) => boolean;

  // Called when the user confirms a new option.
  // Return a SelectOption to override the auto-built one (e.g. to persist to API first).
  onCreate?: (input: string) => void | SelectOption;

  // Label rendered on the "Create …" row in the dropdown.
  // Default: (v) => `Create "${v}"`
  createOptionLabel?: (input: string) => string;

  // ── Accessibility ─────────────────────────────────────────────────────

  // id placed on the internal search <input> so <label for="…"> works.
  inputId?: string;

  // aria-label for the combobox when no visible <label> element exists.
  ariaLabel?: string;

  // aria-labelledby pointing to an external element's id.
  ariaLabelledBy?: string;

  // ── Events ────────────────────────────────────────────────────────────

  // Primary change handler. Includes what changed and which option triggered it.
  onChange?: (value: string | string[], change: SelectChange) => void;

  // Fires when the dropdown opens.
  onOpen?: () => void;

  // Fires when the dropdown closes.
  onClose?: () => void;

  // Fires on every keystroke in the search input.
  onSearch?: (term: string) => void;

  // Imperative loading hooks — useful for vanilla JS consumers.
  // Reactive consumers can derive this from SelectState.isLoading instead.
  onLoadStart?: () => void;
  onLoadEnd?: (options: SelectOption[]) => void;
}

// ─── Prop Getters ─────────────────────────────────────────────────────────────

export interface TriggerProps {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup': string;
  'aria-controls': string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-disabled': boolean;
  tabIndex: number;
  onClick: () => void;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onKeyDown: (e: any) => void;
}

export interface ListboxProps {
  id: string;
  role: string;
  'aria-multiselectable': boolean;
  'aria-label'?: string;
}

export interface OptionProps {
  id: string;
  role: string;
  'aria-selected': boolean;
  'aria-disabled': boolean;
  'data-focused': boolean;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onClick: (e: any) => void;
  onMouseEnter: () => void;
}

export interface SearchInputProps {
  id?: string;
  type: string;
  role: string;
  autoComplete: string;
  'aria-autocomplete': string;
  'aria-controls': string;
  'aria-activedescendant'?: string;
  value: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onInput: (e: any) => void;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onKeyDown: (e: any) => void;
}

// ─── Instance ────────────────────────────────────────────────────────────────

export type Unsubscribe = () => void;

export interface SelectInstance {
  getState: () => SelectState;
  getConfig: () => SelectConfig;
  subscribe: (listener: (s: SelectState) => void) => Unsubscribe;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectOption: (value: string) => void;
  deselectOption: (value: string) => void;
  toggleOption: (value: string) => void;
  clearAll: () => void;
  setSearch: (term: string) => void;
  focusOption: (value: string | null) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  createOption: (input: string) => void;
  scrollToFocused: (container: HTMLElement) => void;
  setConfig: (patch: Partial<SelectConfig>) => void;
  destroy: () => void;

  // Prop Getters
  getTriggerProps: () => TriggerProps;
  getListboxProps: () => ListboxProps;
  getOptionProps: (value: string) => OptionProps;
  getSearchInputProps: () => SearchInputProps;

  // Legacy/Helpers (compatible with existing code)
  getOptionLabel: (value: string) => string;
  getSelectedOptions: () => SelectOption[];
}
