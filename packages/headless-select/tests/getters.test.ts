import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSelect } from '../src/useSelect';

describe('Prop Getters tests', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ];

  let dummyEl: HTMLSelectElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    dummyEl = document.createElement('select');
    document.body.appendChild(dummyEl);
  });

  it('getTriggerProps returns correct ARIA and event handlers', () => {
    const select = useSelect({
      options,
      ariaLabel: 'Select a fruit',
      ariaLabelledBy: 'label-id',
      disabled: false,
    });

    const triggerProps = select.getTriggerProps();
    expect(triggerProps.role).toBe('combobox');
    expect(triggerProps['aria-expanded']).toBe(false);
    expect(triggerProps['aria-haspopup']).toBe('listbox');
    expect(triggerProps['aria-controls']).toBe(select.getListboxProps().id);
    expect(triggerProps['aria-label']).toBe('Select a fruit');
    expect(triggerProps['aria-labelledby']).toBe('label-id');
    expect(triggerProps['aria-disabled']).toBe(false);
    expect(triggerProps.tabIndex).toBe(0);
    expect(typeof triggerProps.onClick).toBe('function');
    expect(typeof triggerProps.onKeyDown).toBe('function');

    // If disabled
    const selectDisabled = useSelect({
      options,
      disabled: true,
    });
    const triggerPropsDisabled = selectDisabled.getTriggerProps();
    expect(triggerPropsDisabled['aria-disabled']).toBe(true);
    expect(triggerPropsDisabled.tabIndex).toBe(-1);
  });

  it('getListboxProps returns correct ARIA', () => {
    const selectSingle = useSelect({
      options,
      ariaLabel: 'My listbox',
      multiple: false,
    });
    const listboxPropsSingle = selectSingle.getListboxProps();
    expect(listboxPropsSingle.role).toBe('listbox');
    expect(listboxPropsSingle['aria-multiselectable']).toBe(false);
    expect(listboxPropsSingle['aria-label']).toBe('My listbox');

    const selectMulti = useSelect({
      options,
      multiple: true,
    });
    const listboxPropsMulti = selectMulti.getListboxProps();
    expect(listboxPropsMulti['aria-multiselectable']).toBe(true);
  });

  it('getOptionProps returns correct props and triggers actions', () => {
    const select = useSelect({
      options,
      value: 'apple',
    });

    // Selected option
    const optionPropsApple = select.getOptionProps('apple');
    expect(optionPropsApple.role).toBe('option');
    expect(optionPropsApple['aria-selected']).toBe(true);
    expect(optionPropsApple['aria-disabled']).toBe(false);
    expect(optionPropsApple['data-focused']).toBe(false);
    expect(typeof optionPropsApple.onClick).toBe('function');
    expect(typeof optionPropsApple.onMouseEnter).toBe('function');

    // Focused option
    select.open();
    select.focusOption('apple');
    const optionPropsAppleFocused = select.getOptionProps('apple');
    expect(optionPropsAppleFocused['data-focused']).toBe(true);

    // Disabled option
    const optionPropsBanana = select.getOptionProps('banana');
    expect(optionPropsBanana['aria-disabled']).toBe(true);

    // Click behavior
    const mockEvent = { preventDefault: vi.fn() } as unknown as MouseEvent;
    optionPropsApple.onClick(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    // Since apple is selected and multiple is false, select option logic runs:
    expect(select.getState().selectedValues).toEqual(['apple']);

    // Try clicking disabled banana
    const bananaEvent = { preventDefault: vi.fn() } as unknown as MouseEvent;
    optionPropsBanana.onClick(bananaEvent);
    expect(bananaEvent.preventDefault).toHaveBeenCalled();
    // Nothing should change
    expect(select.getState().selectedValues).toEqual(['apple']);

    // onMouseEnter handles focus if not within collision timer
    optionPropsApple.onMouseEnter();
    expect(select.getState().focusedOptionValue).toBe('apple');
  });

  it('getSearchInputProps returns correct props and handles typing', () => {
    const select = useSelect({
      options,
      inputId: 'my-search-input',
    });

    const searchProps = select.getSearchInputProps();
    expect(searchProps.id).toBe('my-search-input');
    expect(searchProps.type).toBe('text');
    expect(searchProps.role).toBe('searchbox');
    expect(searchProps.autoComplete).toBe('off');
    expect(searchProps['aria-autocomplete']).toBe('list');
    expect(searchProps['aria-controls']).toBe(select.getListboxProps().id);
    expect(searchProps['aria-activedescendant']).toBeUndefined();
    expect(searchProps.value).toBe('');

    // Input events
    const inputEvent = {
      target: { value: 'che' },
    } as unknown as InputEvent;
    searchProps.onInput(inputEvent);
    expect(select.getState().search).toBe('che');

    // Search input focused descendant
    select.open();
    select.focusOption('cherry');
    const searchPropsFocused = select.getSearchInputProps();
    expect(searchPropsFocused['aria-activedescendant']).toBe(select.getOptionProps('cherry').id);
  });

  it('getNativeSelectProps returns correct properties', () => {
    const select = useSelect({
      options,
      multiple: true,
      disabled: true,
    });

    const nativeProps = select.getNativeSelectProps();
    expect(nativeProps.multiple).toBe(true);
    expect(nativeProps.disabled).toBe(true);
    expect(nativeProps['aria-hidden']).toBe(true);
    expect(nativeProps.tabIndex).toBe(-1);
    expect(nativeProps.style).toBeTypeOf('object');
    expect(nativeProps.style.position).toBe('absolute');
  });

  it('getCreateOptionProps returns correct properties when canCreate is active', () => {
    const selectNoCreate = useSelect({
      options,
      creatable: false,
    });
    expect(selectNoCreate.getCreateOptionProps()).toBeNull();

    const select = useSelect({
      options,
      creatable: true,
      createOptionLabel: (search) => `Add option: ${search}`,
    });
    select.setSearch('new-item');
    const createProps = select.getCreateOptionProps();
    expect(createProps).not.toBeNull();
    expect(createProps?.role).toBe('button');
    expect(createProps?.['aria-label']).toBe('Add option: new-item');

    // Default label fallback
    const selectDefaultLabel = useSelect({
      options,
      creatable: true,
    });
    selectDefaultLabel.setSearch('xyz');
    expect(selectDefaultLabel.getCreateOptionProps()?.['aria-label']).toBe('Create "xyz"');

    // Click handler
    createProps?.onClick();
    expect(select.getState().selectedValues).toEqual(['new-item']);
  });

  it('getClearOptionProps returns correct properties', () => {
    const select = useSelect({
      options,
      multiple: true,
      defaultValue: ['apple', 'cherry'],
    });

    const clearAppleProps = select.getClearOptionProps('apple');
    expect(clearAppleProps.role).toBe('button');
    expect(clearAppleProps['aria-label']).toBe('Deselect apple');

    const clickEvent = { stopPropagation: vi.fn() } as unknown as MouseEvent;
    clearAppleProps.onClick(clickEvent);
    expect(clickEvent.stopPropagation).toHaveBeenCalled();
    expect(select.getState().selectedValues).toEqual(['cherry']);
  });
});
