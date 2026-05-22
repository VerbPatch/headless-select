/**
 * Represents a single selectable option in the dropdown.
 * @group types
 * @title SelectOption
 * @description Defines the structure for a standard select option, including its value, label, and metadata.
 */
export type SelectOption = {
  /**
   * The machine-readable value stored and emitted by the select.
   */
  value: string;
  /**
   * The human-readable label displayed in the UI.
   */
  label: string;
  /**
   * Whether the option is disabled and cannot be selected.
   */
  disabled?: boolean;
  /**
   * Arbitrary metadata associated with the option.
   */

  [key: string]: any;
};

/**
 * Represents a group of options in the dropdown.
 * @group types
 * @title SelectGroup
 * @description Defines a group of options with a shared label and optional group-level disabled state.
 */
export type SelectGroup = {
  /**
   * The heading label for the group.
   */
  label: string;
  /**
   * The list of options belonging to this group.
   */
  options: SelectOption[];
  /**
   * Whether the entire group and its options are disabled.
   */
  disabled?: boolean;
};

/**
 * A union type representing either a single option or a group of options.
 * @group types
 * @title DataItem
 * @description Used to define the list of items provided to the select component.
 */
export type DataItem = SelectOption | SelectGroup;

/**
 * Type guard to check if a DataItem is a SelectGroup.
 * @group utilities
 * @title isGroup
 * @description Returns true if the item contains an options array.
 * @param {DataItem} item - The item to check.
 * @returns {boolean} - True if the item is a group.
 */
export function isGroup(item: DataItem): item is SelectGroup {
  return 'options' in item;
}

/**
 * Represents the internal state of a select instance.
 * @group types
 * @title SelectState
 * @description Holds all reactive state for the select, including visibility, search term, and selections.
 */
export interface SelectState {
  /**
   * Whether the dropdown menu is currently open.
   */
  isOpen: boolean;
  /**
   * The current search string typed by the user.
   */
  search: string;
  /**
   * The list of currently selected values.
   */
  selectedValues: string[];
  /**
   * All resolved options after processing groups and asynchronous loading.
   */
  resolvedOptions: SelectOption[];
  /**
   * The subset of options currently visible in the dropdown (filtered by search).
   */
  visibleOptions: SelectOption[];
  /**
   * The value of the option currently focused via keyboard navigation.
   */
  focusedOptionValue: string | null;
  /**
   * Whether the "Create" option should be displayed based on current search.
   */
  canCreate: boolean;
  /**
   * Whether an asynchronous load operation is currently in progress.
   */
  isLoading: boolean;
  /**
   * Any error that occurred during data fetching or state transitions.
   */
  error: Error | null;
  /**
   * Current virtualization window and calculations.
   */
  virtualization?: {
    startIndex: number;
    endIndex: number;
    totalHeight: number;
    offsetY: number;
    items: { index: number; top: number }[];
  };
}

/**
 * Metadata emitted during a selection change event.
 * @group types
 * @title SelectChange
 * @description Provides details about the type of change and the specific option involved.
 */
export type SelectChange = {
  /**
   * The type of change action performed.
   */
  type: 'select' | 'deselect' | 'clear' | 'create';
  /**
   * The option involved in the change, or null if it was a clear action.
   */
  option: SelectOption | null;
};

/**
 * Configuration options for initializing a select instance.
 * @group types
 * @title SelectConfig
 * @description Defines all behavior, data source, and visual options for the select component.
 */
export interface SelectConfig {
  /**
   * The currently selected value(s) for controlled mode.
   */
  value?: string | string[];
  /**
   * The initial selected value(s) for uncontrolled mode.
   */
  defaultValue?: string | string[];
  /**
   * Static list of options or groups.
   */
  options?: DataItem[];
  /**
   * Function to load options asynchronously based on search input.
   */
  loadOptions?: (search: string) => Promise<SelectOption[]>;
  /**
   * Initial options to show, or true to trigger an immediate load on open.
   */
  defaultOptions?: boolean | SelectOption[];
  /**
   * Whether to cache results from loadOptions based on the search term.
   */
  cacheOptions?: boolean;
  /**
   * An existing HTMLSelectElement to hydrate initial state from.
   */
  hydrateFrom?: HTMLSelectElement;
  /**
   * Whether multiple options can be selected simultaneously.
   */
  multiple?: boolean;
  /**
   * Whether to display a search input for filtering options.
   */
  searchable?: boolean;
  /**
   * Whether to show a clear button to deselect all items.
   */
  clearable?: boolean;
  /**
   * Whether the select component is disabled.
   */
  disabled?: boolean;
  /**
   * Whether users can create new options from the search input.
   */
  creatable?: boolean;
  /**
   * Whether to close the dropdown immediately after a selection is made.
   */
  closeOnSelect?: boolean;
  /**
   * Custom filter function for client-side search.
   */
  filterOption?: (option: SelectOption, search: string) => boolean;
  /**
   * Delay in milliseconds before executing asynchronous searches.
   */
  searchDelay?: number;
  /**
   * Minimum search string length required to trigger a search.
   */
  minSearchLength?: number;
  /**
   * Placeholder text shown when no value is selected.
   */
  placeholder?: string;
  /**
   * Message shown while loading options.
   */
  loadingMessage?: string;
  /**
   * Message shown when no matching options are found.
   */
  noOptionsMessage?: string | ((search: string) => string);
  /**
   * Validation function for new options in creatable mode.
   */
  isValidNewOption?: (input: string, currentOptions: SelectOption[]) => boolean;
  /**
   * Callback triggered when a new option is created.
   */
  onCreate?: (input: string) => void | SelectOption;
  /**
   * Factory function for the label of the "Create" option.
   */
  createOptionLabel?: (input: string) => string;
  /**
   * Whether to enable list virtualization for high-performance rendering.
   */
  virtualize?: boolean;
  /**
   * Fixed height for each list item in pixels (required for virtualization).
   */
  itemHeight?: number;
  /**
   * Total height of the scrollable list container (required for virtualization).
   */
  containerHeight?: number;
  /**
   * ID for the internal search input element.
   */
  inputId?: string;
  /**
   * Accessibility label for the select component.
   */
  ariaLabel?: string;
  /**
   * ID of the element that labels the select component.
   */
  ariaLabelledBy?: string;
  /**
   * Callback triggered when the selected value(s) change.
   */
  onChange?: (value: string | string[], change: SelectChange) => void;
  /**
   * Callback triggered when the dropdown is opened.
   */
  onOpen?: () => void;
  /**
   * Callback triggered when the dropdown is closed.
   */
  onClose?: () => void;
  /**
   * Callback triggered on every search input change.
   */
  onSearch?: (term: string) => void;
  /**
   * Callback triggered when an asynchronous load starts.
   */
  onLoadStart?: () => void;
  /**
   * Callback triggered when an asynchronous load completes.
   */
  onLoadEnd?: (options: SelectOption[]) => void;
}

/**
 * Attributes and handlers for the select trigger element.
 * @group getters
 * @title TriggerProps
 * @description Standard ARIA attributes and events required for a button that opens the select menu.
 */
export interface TriggerProps {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-controls': string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-disabled': boolean;
  tabIndex: number;
  onClick: () => void;

  onKeyDown: (e: any) => void;
}

/**
 * Attributes for the listbox container element.
 * @group getters
 * @title ListboxProps
 * @description Standard ARIA attributes required for the scrollable list of options.
 */
export interface ListboxProps {
  id: string;
  role: string;
  'aria-multiselectable': boolean;
  'aria-label'?: string;
}

/**
 * Attributes and handlers for an individual option element.
 * @group getters
 * @title OptionProps
 * @description Standard ARIA attributes and events required for selectable items within the listbox.
 */
export interface OptionProps {
  id: string;
  role: string;
  'aria-selected': boolean;
  'aria-disabled': boolean;
  'data-focused': boolean;

  onClick: (e: any) => void;
  onMouseEnter: () => void;
}

/**
 * Attributes and handlers for the search input element.
 * @group getters
 * @title SearchInputProps
 * @description Standard attributes and events required for filtering options via text input.
 */
export interface SearchInputProps {
  id?: string;
  type: string;
  role: string;
  autoComplete: string;
  'aria-autocomplete': 'list';
  'aria-controls': string;
  'aria-activedescendant'?: string;
  value: string;

  onInput: (e: any) => void;

  onKeyDown: (e: any) => void;
}

/**
 * Function to unsubscribe from state changes.
 * @group types
 * @title Unsubscribe
 * @description Stops the listener from receiving further updates.
 */
export type Unsubscribe = () => void;

/**
 * The main instance object for managing a select component.
 * @group types
 * @title SelectInstance
 * @description Provides direct access to state, configuration, and imperative actions.
 */
export interface SelectInstance {
  /**
   * Returns the current internal state.
   */
  getState: () => SelectState;
  /**
   * Returns the current configuration options.
   */
  getConfig: () => SelectConfig;
  /**
   * Subscribes to state changes and returns an unsubscribe function.
   */
  subscribe: (listener: (s: SelectState) => void) => Unsubscribe;
  /**
   * Opens the dropdown menu.
   */
  open: () => void;
  /**
   * Closes the dropdown menu.
   */
  close: () => void;
  /**
   * Toggles the open/closed state of the dropdown menu.
   */
  toggle: () => void;
  /**
   * Selects an option by its value.
   */
  selectOption: (value: string) => void;
  /**
   * Deselects an option by its value.
   */
  deselectOption: (value: string) => void;
  /**
   * Toggles the selection state of an option by its value.
   */
  toggleOption: (value: string) => void;
  /**
   * Deselects all currently selected values.
   */
  clearAll: () => void;
  /**
   * Sets the current search term and filters options.
   */
  setSearch: (term: string) => void;
  /**
   * Manually sets the focus to an option by value.
   */
  focusOption: (value: string | null) => void;
  /**
   * Moves focus to the next visible option.
   */
  focusNext: () => void;
  /**
   * Moves focus to the previous visible option.
   */
  focusPrev: () => void;
  /**
   * Moves focus to the first visible option.
   */
  focusFirst: () => void;
  /**
   * Moves focus to the last visible option.
   */
  focusLast: () => void;
  /**
   * Creates a new option from the provided input string.
   */
  createOption: (input: string) => void;
  /**
   * Ensures the currently focused option is visible within its container.
   */
  scrollToFocused: (container: HTMLElement) => void;
  /**
   * Forces a synchronization of internal state (useful for manual configuration changes).
   */
  sync: () => void;
  /**
   * Updates virtualization calculations based on scroll position.
   */
  onScroll: (scrollTop: number) => void;
  /**
   * Patches the current configuration with new values.
   */
  setConfig: (patch: Partial<SelectConfig>) => void;
  /**
   * Cleans up the instance and destroys all internal subscriptions.
   */
  destroy: () => void;
  /**
   * Generates props for the trigger element.
   */
  getTriggerProps: () => TriggerProps;
  /**
   * Generates props for the listbox element.
   */
  getListboxProps: () => ListboxProps;
  /**
   * Generates props for a specific option element.
   */
  getOptionProps: (value: string) => OptionProps;
  /**
   * Generates props for the search input element.
   */
  getSearchInputProps: () => SearchInputProps;
  /**
   * Generates props for a native select element (progressive enhancement).
   */
  getNativeSelectProps: () => any;
  /**
   * Generates props for the "Create" option row.
   */
  getCreateOptionProps: () => any;
  /**
   * Generates props for a clear button specific to an option (multi-select tags).
   */
  getClearOptionProps: (value: string) => any;
  /**
   * Helper to retrieve the label for a given option value.
   */
  getOptionLabel: (value: string) => string;
  /**
   * Returns the list of currently selected SelectOption objects.
   */
  getSelectedOptions: () => SelectOption[];
}
