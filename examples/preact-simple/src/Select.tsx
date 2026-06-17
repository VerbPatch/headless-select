import { h, Fragment } from 'preact';
import { useRef, useEffect, useMemo } from 'preact/hooks';
import { useSelect } from '@verbpatch/preact-select';

interface SelectProps {
  children?: any;
  virtualize?: boolean;
  itemHeight?: number;
  containerHeight?: number;
  showNative?: boolean;
  hideNative?: boolean;
  [key: string]: any;
}

export function Select({
  children,
  virtualize = false,
  itemHeight = 35,
  containerHeight = 300,
  showNative = true,
  hideNative = false,
  ...config
}: SelectProps) {
  const renderCount = useRef(0);
  renderCount.current++;

  const {
    state,
    instance,
    nativeRef,
    getTriggerProps,
    getListboxProps,
    getOptionProps,
    getSearchInputProps,
    getNativeSelectProps,
    getCreateOptionProps,
    getClearOptionProps,
  } = useSelect({
    ...config,
    virtualize,
    itemHeight,
    containerHeight,
  });

  const listboxRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state.isOpen && listboxRef.current && !isScrollingRef.current) {
      if (Math.abs(listboxRef.current.scrollTop - state.scrollTop) > 1) {
        listboxRef.current.scrollTop = state.scrollTop;
      }
    }
  }, [state.isOpen, state.scrollTop]);

  const handleScroll = (e: Event) => {
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
    instance?.onScroll((e.currentTarget as HTMLDivElement).scrollTop);
  };

  const selectedOptions = useMemo(() => {
    return instance?.getSelectedOptions() || [];
  }, [state.selectedValues, state.resolvedOptions, instance]);

  const renderOption = (option: any, style: any = {}) => {
    const props = getOptionProps(option.value);
    const isFocused = props['data-focused'];
    const isSelected = props['aria-selected'];

    return (
      <div
        key={option.value}
        {...props}
        class={[
          'option-item',
          isFocused && 'focused',
          isSelected && 'selected',
          option.disabled && 'disabled',
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
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
  };

  return (
    <div class="select-container">
      <div class="render-count-badge">Render Count: {renderCount.current}</div>
      {showNative && (
        <div class={`native-interface-container ${hideNative ? 'hidden' : ''}`}>
          {!hideNative && <label>Native Select Interface</label>}
          <select
            ref={nativeRef}
            {...getNativeSelectProps()}
            class={['native-select', hideNative && 'hidden', !hideNative && 'visible']
              .filter(Boolean)
              .join(' ')}
            style={{
              height: hideNative ? '1px' : config.multiple || virtualize ? '120px' : 'auto',
            }}
          >
            {(config.options || config.fetchRemoteOptions || config.creatable)
              ? state.resolvedOptions?.map((opt: any) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
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
        <button {...getTriggerProps()} class="select-trigger">
          {state.selectedValues.length > 0 ? (
            config.multiple ? (
              <div class="selected-values-container">
                {selectedOptions.map((opt) => (
                  <span key={opt.value} class="selected-value-pill">
                    {opt.label}
                    <span {...getClearOptionProps(opt.value)} class="selected-value-clear">
                      ×
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              (instance?.getOptionLabel(state.selectedValues[0]) ?? state.selectedValues[0])
            )
          ) : (
            config.placeholder || 'Select...'
          )}
        </button>

        {state.isOpen && (
          <div class="select-dropdown">
            {config.searchable !== false && (
              <div class="search-container">
                <input
                  {...getSearchInputProps()}
                  class="search-input"
                  placeholder={virtualize ? 'Search 10,000 items...' : 'Search options...'}
                  autoFocus
                />
              </div>
            )}

            <div
              {...getListboxProps()}
              ref={listboxRef}
              onScroll={handleScroll}
              class="listbox-container"
              style={{
                maxHeight: virtualize ? `${containerHeight}px` : '250px',
                height: virtualize ? `${containerHeight}px` : 'auto',
              }}
            >
              {state.isLoading ? (
                <div class="loading-state">Loading...</div>
              ) : (
                <Fragment>
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
                          return renderOption(option, {
                            position: 'absolute',
                            top: `${actualIndex * itemHeight}px`,
                            height: `${itemHeight}px`,
                            width: '100%',
                            boxSizing: 'border-box',
                          });
                        })}
                    </div>
                  ) : (
                    state.visibleOptions.map((option) => renderOption(option))
                  )}

                  {state.canCreate && (
                    <div {...getCreateOptionProps()} class="create-option">
                      + Create "{state.search}"
                    </div>
                  )}

                  {state.visibleOptions.length === 0 && !state.canCreate && (
                    <div class="empty-state">No results found</div>
                  )}
                </Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
