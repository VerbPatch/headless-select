import { useRef, useState, useEffect, useMemo } from 'react';
import { useSelect, SelectConfig, calculateVirtualization } from '@verbpatch/react-select';

interface SelectProps extends Omit<SelectConfig, 'hydrateFrom'> {
  children?: React.ReactNode;
  virtualize?: boolean;
  itemHeight?: number;
  containerHeight?: number;
}

export default function Select({ 
  children, 
  virtualize = false,
  itemHeight = 35,
  containerHeight = 300,
  ...config 
}: SelectProps) {
  const nativeRef = useRef<HTMLSelectElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Force a re-render once the ref is attached so the hook can initialize
  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (nativeRef.current) forceUpdate({});
  }, []);

  const selectConfig = useMemo(() => ({
    ...config,
    hydrateFrom: nativeRef.current!
  }), [config, nativeRef.current]);

  const { state, instance, getTriggerProps, getListboxProps, getOptionProps, getSearchInputProps } =
    useSelect(nativeRef.current ? selectConfig : (null as any));

  // ── Virtualization Logic ──────────────────────────────────────────────────
  const virtual = useMemo(() => {
    if (!virtualize) return null;
    return calculateVirtualization(
      state.visibleOptions.length,
      itemHeight,
      containerHeight,
      scrollTop
    );
  }, [virtualize, state.visibleOptions.length, itemHeight, containerHeight, scrollTop]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (virtualize) {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };

  useEffect(() => {
    if (virtualize && listboxRef.current && state.isOpen) {
      setScrollTop(listboxRef.current.scrollTop);
    }
  }, [virtualize, state.isOpen]);

  // ── Render Helpers ────────────────────────────────────────────────────────
  const renderOption = (option: any, style: React.CSSProperties = {}) => {
    const isFocused = state.focusedOptionValue === option.value;
    const isSelected = state.selectedValues.includes(option.value);

    return (
      <div
        key={option.value}
        {...getOptionProps(option.value)}
        className="option-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isFocused ? '#f0f7ff' : 'transparent',
          fontWeight: isSelected ? 'bold' : 'normal',
          opacity: option.disabled ? 0.4 : 1,
          ...style
        }}
      >
        <span style={{ marginRight: '8px', width: '16px' }}>
          {isSelected ? '●' : '○'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{option.label}</span>
          {option.groupLabel && !virtualize && (
            <span style={{ fontSize: '9px', color: '#999' }}>{option.groupLabel}</span>
          )}
        </div>
        {isFocused && (
          <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#007bff', fontWeight: 'normal' }}>[FOCUS]</span>
        )}
      </div>
    );
  };

  return (
    <div className="select-container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '2rem' }}>
        <label>Native Select Interface</label>
        <select 
          ref={nativeRef} 
          multiple={config.multiple}
          style={{ width: '100%', marginTop: '8px', padding: '4px', height: config.multiple || virtualize ? '120px' : 'auto' }}
        >
          {children}
        </select>
        <div style={{ fontSize: '10px', color: '#999', marginTop: '8px' }}>
          ↑ Native &lt;select&gt; element. 2-way sync active.
          {virtualize && " (10k items sync might be heavy)"}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <label>Headless Custom UI {virtualize && "(Virtualized)"}</label>
        <button {...getTriggerProps()} className="select-trigger" style={{ marginTop: '8px' }}>
          {state.selectedValues.length > 0 ? (
            config.multiple ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {state.selectedValues.map((v) => (
                  <span key={v} style={{ border: '1px solid #ccc', padding: '0 6px', fontSize: '13px', display: 'flex', alignItems: 'center', background: '#fff' }}>
                    {instance?.getOptionLabel(v) ?? v}
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        instance?.deselectOption(v);
                      }}
                      style={{ marginLeft: '6px', cursor: 'pointer', color: '#999' }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              instance?.getOptionLabel(state.selectedValues[0]) ?? state.selectedValues[0]
            )
          ) : (
            config.placeholder || 'Select...'
          )}
        </button>

        {state.isOpen && (
          <div className="select-dropdown">
            {config.searchable !== false && (
              <div className="search-container" style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                <input
                  {...getSearchInputProps()}
                  className="search-input"
                  placeholder={virtualize ? "Search 10,000 items..." : "Search options..."}
                  autoFocus
                />
              </div>
            )}

            <div
              {...getListboxProps()}
              ref={listboxRef}
              onScroll={onScroll}
              className="listbox-container"
              style={{ 
                maxHeight: virtualize ? `${containerHeight}px` : '250px', 
                height: virtualize ? `${containerHeight}px` : 'auto',
                overflowY: 'auto',
                position: 'relative'
              }}
            >
              {state.isLoading ? (
                <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>Loading...</div>
              ) : (
                <>
                  {virtualize && virtual ? (
                    <div style={{ height: virtual.totalHeight, width: '100%' }}>
                      {virtual.items.map((item) => {
                        const option = state.visibleOptions[item.index];
                        if (!option) return null;
                        return renderOption(option, {
                          position: 'absolute',
                          top: item.top,
                          height: itemHeight,
                          width: '100%',
                          boxSizing: 'border-box'
                        });
                      })}
                    </div>
                  ) : (
                    state.visibleOptions.map((option) => renderOption(option))
                  )}

                  {state.canCreate && (
                    <div 
                      onClick={() => instance?.createOption(state.search)}
                      style={{ padding: '10px 12px', cursor: 'pointer', color: '#007bff', borderTop: '1px solid #eee', fontSize: '14px' }}
                    >
                      + Create "{state.search}"
                    </div>
                  )}

                  {state.visibleOptions.length === 0 && !state.canCreate && (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
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
