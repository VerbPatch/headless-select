import { useRef, useEffect } from 'react';
import { useSelect } from '@verbpatch/react-select';

interface SelectProps {
  children?: React.ReactNode;
  virtualize?: boolean;
  itemHeight?: number;
  containerHeight?: number;
  showNative?: boolean;
  hideNative?: boolean;
  [key: string]: any;
}

export default function Select({
  children,
  virtualize = false,
  itemHeight = 35,
  containerHeight = 300,
  showNative = true,
  hideNative = false,
  ...config
}: SelectProps) {
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

  useEffect(() => {
    if (state.isOpen && listboxRef.current) {
      instance.scrollToFocused(listboxRef.current);
    }
  }, [state.isOpen, state.focusedOptionValue, instance]);

  // ── Render Helpers ────────────────────────────────────────────────────────
  const renderOption = (option: any, style: React.CSSProperties = {}) => {
    const props = getOptionProps(option.value);
    const isFocused = props['data-focused'];
    const isSelected = props['aria-selected'];

    return (
      <div
        key={option.value}
        {...props}
        className="option-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isFocused ? '#f0f7ff' : 'transparent',
          fontWeight: isSelected ? 'bold' : 'normal',
          opacity: option.disabled ? 0.4 : 1,
          ...style,
        }}
      >
        <span style={{ marginRight: '8px', width: '16px' }}>{isSelected ? '●' : '○'}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{option.label}</span>
          {option.groupLabel && !virtualize && (
            <span style={{ fontSize: '9px', color: '#999' }}>{option.groupLabel}</span>
          )}
        </div>
        {isFocused && (
          <span
            style={{ marginLeft: 'auto', fontSize: '9px', color: '#007bff', fontWeight: 'normal' }}
          >
            [FOCUS]
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="select-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
      {showNative && (
        <div
          style={{
            flex: hideNative ? 0 : 1,
            borderRight: hideNative ? 'none' : '1px solid #eee',
            paddingRight: hideNative ? '0' : '2rem',
            marginRight: hideNative ? '0' : '2rem',
            display: hideNative ? 'contents' : 'block',
          }}
        >
          {!hideNative && <label>Native Select Interface</label>}
          <select
            ref={nativeRef}
            {...getNativeSelectProps()}
            style={{
              width: hideNative ? '1px' : '100%',
              marginTop: hideNative ? '0' : '8px',
              padding: hideNative ? '0' : '4px',
              height: hideNative ? '1px' : config.multiple || virtualize ? '120px' : 'auto',
              // Toggle between library's "visually hidden" and showcase "visible" styles
              ...(hideNative
                ? {}
                : {
                    position: 'static',
                    clip: 'auto',
                    overflow: 'visible',
                  }),
            }}
          >
            {children}
          </select>
          {!hideNative && (
            <div style={{ fontSize: '10px', color: '#999', marginTop: '8px' }}>
              ↑ Native &lt;select&gt; element. 2-way sync active.
              {virtualize && ' (10k items sync might be heavy)'}
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <label>Headless Custom UI {virtualize && '(Virtualized)'}</label>
        {!showNative && (
          <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>
            (Pure Headless - No Native Sync)
          </div>
        )}
        <button {...getTriggerProps()} className="select-trigger" style={{ marginTop: '8px' }}>
          {state.selectedValues.length > 0 ? (
            config.multiple ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {instance?.getSelectedOptions().map((opt) => (
                  <span
                    key={opt.value}
                    style={{
                      border: '1px solid #ccc',
                      padding: '0 6px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      background: '#fff',
                    }}
                  >
                    {opt.label}
                    <span
                      {...getClearOptionProps(opt.value)}
                      style={{ marginLeft: '6px', cursor: 'pointer', color: '#999' }}
                    >
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
          <div className="select-dropdown">
            {config.searchable !== false && (
              <div
                className="search-container"
                style={{ padding: '8px', borderBottom: '1px solid #eee' }}
              >
                <input
                  {...getSearchInputProps()}
                  className="search-input"
                  placeholder={virtualize ? 'Search 10,000 items...' : 'Search options...'}
                  autoFocus
                />
              </div>
            )}

            <div
              {...getListboxProps()}
              ref={listboxRef}
              onScroll={(e) => instance?.onScroll(e.currentTarget.scrollTop)}
              className="listbox-container"
              style={{
                maxHeight: virtualize ? `${containerHeight}px` : '250px',
                height: virtualize ? `${containerHeight}px` : 'auto',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {state.isLoading ? (
                <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
                  Loading...
                </div>
              ) : (
                <>
                  {virtualize && state.virtualization ? (
                    <div style={{ height: state.virtualization.totalHeight, width: '100%' }}>
                      {state.virtualization.items.map((item) => {
                        const option = state.visibleOptions[item.index];
                        if (!option) return null;
                        return renderOption(option, {
                          position: 'absolute',
                          top: item.top,
                          height: itemHeight,
                          width: '100%',
                          boxSizing: 'border-box',
                        });
                      })}
                    </div>
                  ) : (
                    state.visibleOptions.map((option) => renderOption(option))
                  )}

                  {state.canCreate && (
                    <div
                      {...getCreateOptionProps()}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        color: '#007bff',
                        borderTop: '1px solid #eee',
                        fontSize: '14px',
                      }}
                    >
                      + Create "{state.search}"
                    </div>
                  )}

                  {state.visibleOptions.length === 0 && !state.canCreate && (
                    <div
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '14px',
                      }}
                    >
                      No results found
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
