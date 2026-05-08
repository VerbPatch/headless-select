import { useRef, useState, useEffect, useMemo } from 'react';
import { useSelect, SelectConfig } from '@verbpatch/react-select';
import { calculateVirtualization } from '@verbpatch/headless-select';

interface VirtualizedSelectProps extends Omit<SelectConfig, 'hydrateFrom'> {
  itemHeight?: number;
  containerHeight?: number;
}

export default function VirtualizedSelect({
  itemHeight = 35,
  containerHeight = 300,
  ...config
}: VirtualizedSelectProps) {
  const nativeRef = useRef<HTMLSelectElement>(null);
  
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (nativeRef.current) setReady(true);
  }, []);

  const selectConfig = useMemo(() => ({
    ...config,
    hydrateFrom: nativeRef.current!
  }), [config, ready]);

  const { state, instance, getTriggerProps, getListboxProps, getOptionProps, getSearchInputProps } =
    useSelect(nativeRef.current ? selectConfig : (null as any));

  const listboxRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const virtual = calculateVirtualization(
    state.visibleOptions.length,
    itemHeight,
    containerHeight,
    scrollTop
  );

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    if (listboxRef.current) {
      setScrollTop(listboxRef.current.scrollTop);
    }
  }, [state.visibleOptions.length, state.isOpen]);

  return (
    <div className="select-container">
      {/* 
          The mandatory native select element.
          WE DO NOT RENDER OPTIONS HERE IN REACT.
          React rendering 10,000 <option> tags is extremely slow.
          Headless-select will manage the native options automatically.
      */}
      <select 
        ref={nativeRef} 
        style={{ display: 'none' }} 
        multiple={config.multiple}
      />

      <button {...getTriggerProps()} className="select-trigger">
        {state.selectedValues.length > 0
          ? state.selectedValues.map((v) => instance?.getOptionLabel(v) ?? v).join(', ')
          : config.placeholder || 'Select...'}
      </button>

      {state.isOpen && (
        <div className="select-dropdown">
          {config.searchable !== false && (
            <div className="search-container">
              <input
                {...getSearchInputProps()}
                className="search-input"
                placeholder="Search..."
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
              height: containerHeight,
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: virtual.totalHeight,
                width: '100%',
              }}
            >
              {virtual.items.map((item) => {
                const option = state.visibleOptions[item.index];
                if (!option) return null;

                return (
                  <div
                    key={option.value}
                    {...getOptionProps(option.value)}
                    className="option-item"
                    style={{
                      position: 'absolute',
                      top: item.top,
                      height: itemHeight,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      backgroundColor: state.focusedOptionValue === option.value ? '#f0f0f0' : 'transparent',
                      fontWeight: state.selectedValues.includes(option.value) ? 'bold' : 'normal',
                    }}
                  >
                    {option.label}
                    {state.selectedValues.includes(option.value) && (
                      <span style={{ marginLeft: 'auto' }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>

            {state.visibleOptions.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
