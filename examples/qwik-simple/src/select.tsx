import { component$, Slot, useSignal, useTask$, useVisibleTask$, noSerialize } from '@builder.io/qwik';
import { useSelect, hydrateFromElement } from '@verbpatch/qwik-select';

export interface SelectProps {
  virtualize?: boolean;
  itemHeight?: number;
  containerHeight?: number;
  showNative?: boolean;
  hideNative?: boolean;
  options?: any[];
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  placeholder?: string;
  value?: string | string[];
  onChange?: (val: any) => void;
  fetchRemoteOptions?: (search: string) => Promise<any[]>;
  cacheOptions?: boolean;
  defaultOptions?: boolean | any[];
  [key: string]: any;
}

export const Select = component$((props: SelectProps) => {
  const {
    virtualize = false,
    itemHeight = 35,
    containerHeight = 300,
    showNative = true,
    hideNative = false,
  } = props;

  const {
    store,
    instance,
    getTriggerProps,
    getListboxProps,
    getOptionProps,
    getSearchInputProps,
    getNativeSelectProps,
    getCreateOptionProps,
    getClearOptionProps,
  } = useSelect(props);

  const nativeRef = useSignal<HTMLSelectElement>();
  const listboxRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ track }) => {
    track(() => store.state.isOpen);
    track(() => store.state.scrollTop);
    if (listboxRef.value && store.state.isOpen) {
      if (listboxRef.value.scrollTop !== store.state.scrollTop) {
        listboxRef.value.scrollTop = store.state.scrollTop;
      }
    }
  });

  useVisibleTask$(() => {
    if (nativeRef.value && showNative) {
      if (!props.options) {
        const h = hydrateFromElement(nativeRef.value);
        instance.setConfig({
          options: h.options,
          defaultValue: h.selectedValues,
          multiple: h.multiple,
        });
      }
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => store.state.selectedValues);
    track(() => store.state.resolvedOptions);
    if (nativeRef.value && showNative) {
      const selected = new Set(store.state.selectedValues || []);
      const options = nativeRef.value.options;
      for (let i = 0; i < options.length; i++) {
        options[i].selected = selected.has(options[i].value);
      }
    }
  });

  const state = store.state;

  return (
    <div class="select-container">
      <div class="render-count-badge">Qwik Auto-Reactivity</div>
      {showNative && (
        <div class={['native-interface-container', hideNative ? 'hidden' : ''].filter(Boolean).join(' ')}>
          {!hideNative && <label>Native Select Interface</label>}
          <select
            ref={nativeRef}
            {...(getNativeSelectProps() as any)}
            class={['native-select', hideNative ? 'hidden' : 'visible'].filter(Boolean).join(' ')}
            style={{
              height: hideNative ? '1px' : props.multiple || virtualize ? '120px' : 'auto',
            }}
            onChange$={async (e) => {
              const el = e.target as HTMLSelectElement;
              const values = Array.from(el.selectedOptions).map((opt) => opt.value);
              if (props.onChange) {
                const multiple = props.multiple ?? false;
                const newValue = multiple ? values : (values[0] ?? '');
                await (props.onChange as any)(newValue);
              } else {
                const current = store.state.selectedValues || [];
                values.forEach((v) => {
                  if (!current.includes(v)) {
                    instance.selectOption(v);
                  }
                });
                current.forEach((v) => {
                  if (!values.includes(v)) {
                    instance.deselectOption(v);
                  }
                });
              }
            }}
          >
            {(props.options || props.fetchRemoteOptions || props.creatable) ? (
              state.resolvedOptions?.map((opt) => (
                <option value={opt.value} key={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            ) : (
              <Slot />
            )}
          </select>
          {!hideNative && (
            <div class="native-note">
              ↑ Native &lt;select&gt; element. 2-way sync active.
              {virtualize && ' (10k items sync might be heavy)'}
            </div>
          )}
        </div>
      )}

      <div class="custom-ui-wrapper">
        <label>Headless Custom UI {virtualize && '(Virtualized)'}</label>
        {!showNative && <div class="custom-ui-note">(Pure Headless - No Native Sync)</div>}
        <button 
          {...(getTriggerProps() as any)} 
          aria-expanded={state.isOpen}
          class="select-trigger"
        >
          {state.selectedValues?.length > 0 ? (
            props.multiple ? (
              <div class="selected-values-container">
                {(state.resolvedOptions || [])
                  .filter((opt) => state.selectedValues.includes(opt.value))
                  .map((opt) => (
                    <span class="selected-value-pill" key={opt.value}>
                      {opt.label}
                      <span {...(getClearOptionProps(opt.value) as any)} class="selected-value-clear">
                        ×
                      </span>
                    </span>
                  ))}
              </div>
            ) : (
              state.resolvedOptions?.find((o) => o.value === state.selectedValues[0])?.label ?? state.selectedValues[0]
            )
          ) : (
            props.placeholder || 'Select...'
          )}
        </button>

        {state.isOpen && (
          <div class="select-dropdown">
            {props.searchable !== false && (
              <div class="search-container">
                <input
                  {...(getSearchInputProps() as any)}
                  class="search-input"
                  placeholder={virtualize ? 'Search 10,000 items...' : 'Search options...'}
                  autoFocus
                />
              </div>
            )}

            <div
              {...(getListboxProps() as any)}
              ref={listboxRef}
              onScroll$={(e) => instance.onScroll((e.target as HTMLElement).scrollTop)}
              class="listbox-container"
              style={{
                maxHeight: virtualize ? `${containerHeight}px` : '250px',
                height: virtualize ? `${containerHeight}px` : 'auto',
              }}
            >
              {state.isLoading ? (
                <div class="loading-state">Loading...</div>
              ) : (
                <>
                  {virtualize && state.virtualization ? (
                    <div
                      style={{
                        height: `${state.virtualization.totalHeight}px`,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {state.visibleOptions
                        .slice(state.virtualization.startIndex, state.virtualization.endIndex)
                        .map((option, idx) => {
                          const actualIndex = state.virtualization!.startIndex + idx;
                          const optProps = getOptionProps(option.value);
                          const isFocused = state.focusedOptionValue === option.value;
                          const isSelected = state.selectedValues?.includes(option.value);
                          const classes = [
                            'option-item',
                            isFocused && 'focused',
                            isSelected && 'selected',
                            option.disabled && 'disabled',
                          ].filter(Boolean).join(' ');

                          return (
                            <div
                              {...(optProps as any)}
                              aria-selected={isSelected}
                              data-focused={isFocused}
                              class={classes}
                              style={{
                                position: 'absolute',
                                top: `${actualIndex * itemHeight}px`,
                                height: `${itemHeight}px`,
                                width: '100%',
                                boxSizing: 'border-box',
                              }}
                              key={option.value}
                            >
                              <span class="option-icon">{isSelected ? '●' : '○'}</span>
                              <div class="option-label-container">
                                <span>{option.label}</span>
                              </div>
                              {isFocused && <span class="option-focus-badge">[FOCUS]</span>}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    state.visibleOptions?.map((option) => {
                      const optProps = getOptionProps(option.value);
                      const isFocused = state.focusedOptionValue === option.value;
                      const isSelected = state.selectedValues?.includes(option.value);
                      const classes = [
                        'option-item',
                        isFocused && 'focused',
                        isSelected && 'selected',
                        option.disabled && 'disabled',
                      ].filter(Boolean).join(' ');

                      return (
                        <div 
                          {...(optProps as any)} 
                          aria-selected={isSelected}
                          data-focused={isFocused}
                          class={classes} 
                          key={option.value}
                        >
                          <span class="option-icon">{isSelected ? '●' : '○'}</span>
                          <div class="option-label-container">
                            <span>{option.label}</span>
                            {option.groupLabel && !virtualize && (
                              <span class="option-group-label">{option.groupLabel}</span>
                            )}
                          </div>
                          {isFocused && <span class="option-focus-badge">[FOCUS]</span>}
                        </div>
                      );
                    })
                  )}

                  {state.canCreate && (
                    <div {...(getCreateOptionProps() as any)} class="create-option">
                      + Create "{state.search}"
                    </div>
                  )}

                  {state.visibleOptions?.length === 0 && !state.canCreate && (
                    <div class="empty-state">No results found</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
