import { useSelect } from '@verbpatch/solidjs-select';
import { Show, For, createEffect, splitProps, mergeProps, createSignal } from 'solid-js';

interface SelectProps {
  children?: any;
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

export default function Select(props: SelectProps) {
  const merged = mergeProps(
    {
      virtualize: false,
      itemHeight: 35,
      containerHeight: 300,
      showNative: true,
      hideNative: false,
    },
    props,
  );

  const [local, configProps] = splitProps(merged, [
    'children',
    'virtualize',
    'itemHeight',
    'containerHeight',
    'showNative',
    'hideNative',
  ]);

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
    getOptionLabel,
    getSelectedOptions,
  } = useSelect(() => configProps);

  let listboxRef: HTMLDivElement | undefined;

  const [renderCount, setRenderCount] = createSignal(1);
  createEffect(() => {
    state();
    setRenderCount((c) => c + 1);
  });

  createEffect(() => {
    if (listboxRef && state().isOpen) {
      if (listboxRef.scrollTop !== state().scrollTop) {
        listboxRef.scrollTop = state().scrollTop;
      }
    }
  });

  const renderOption = (option: any, style: any = {}) => {
    const optProps = getOptionProps(option.value);

    return (
      <div
        {...optProps}
        class={[
          'option-item',
          optProps['data-focused'] && 'focused',
          optProps['aria-selected'] && 'selected',
          option.disabled && 'disabled',
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
      >
        <span class="option-icon">{optProps['aria-selected'] ? '●' : '○'}</span>
        <div class="option-label-container">
          <span>{option.label}</span>
          <Show when={option.groupLabel && !local.virtualize}>
            <span class="option-group-label">{option.groupLabel}</span>
          </Show>
        </div>
        <Show when={optProps['data-focused']}>
          <span class="option-focus-badge">[FOCUS]</span>
        </Show>
      </div>
    );
  };

  return (
    <div class="select-container">
      <div class="render-count-badge">Render Updates: {renderCount()}</div>
      <Show when={local.showNative}>
        <div
          class={['native-interface-container', local.hideNative && 'hidden']
            .filter(Boolean)
            .join(' ')}
        >
          <Show when={!local.hideNative}>
            <label>Native Select Interface</label>
          </Show>
          <select
            ref={nativeRef}
            {...getNativeSelectProps()}
            class={['native-select', local.hideNative && 'hidden', !local.hideNative && 'visible']
              .filter(Boolean)
              .join(' ')}
            style={{
              height: local.hideNative
                ? '1px'
                : configProps.multiple || local.virtualize
                  ? '120px'
                  : 'auto',
            }}
          >
            {local.children}
          </select>
          <Show when={!local.hideNative}>
            <div class="native-note">
              ↑ Native &lt;select&gt; element. 2-way sync active.
              <Show when={local.virtualize}>{' (10k items sync might be heavy)'}</Show>
            </div>
          </Show>
        </div>
      </Show>

      <div class="custom-ui-wrapper">
        <label>Headless Custom UI {local.virtualize && '(Virtualized)'}</label>
        <Show when={!local.showNative}>
          <div class="custom-ui-note">(Pure Headless - No Native Sync)</div>
        </Show>
        <button {...getTriggerProps()} class="select-trigger">
          <Show
            when={state().selectedValues.length > 0}
            fallback={configProps.placeholder || 'Select...'}
          >
            <Show when={configProps.multiple} fallback={getOptionLabel(state().selectedValues[0])}>
              <div class="selected-values-container">
                <For each={getSelectedOptions()}>
                  {(opt) => (
                    <span class="selected-value-pill">
                      {opt.label}
                      <span {...getClearOptionProps(opt.value)} class="selected-value-clear">
                        ×
                      </span>
                    </span>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </button>

        <Show when={state().isOpen}>
          <div class="select-dropdown">
            <Show when={configProps.searchable !== false}>
              <div class="search-container">
                <input
                  {...getSearchInputProps()}
                  class="search-input"
                  placeholder={local.virtualize ? 'Search 10,000 items...' : 'Search options...'}
                  autofocus
                />
              </div>
            </Show>

            <div
              {...getListboxProps()}
              ref={listboxRef}
              onScroll={(e) => instance.onScroll(e.currentTarget.scrollTop)}
              class="listbox-container"
              style={{
                'max-height': local.virtualize ? `${local.containerHeight}px` : '250px',
                height: local.virtualize ? `${local.containerHeight}px` : 'auto',
              }}
            >
              <Show
                when={state().isLoading}
                fallback={
                  <>
                    <Show
                      when={local.virtualize && state().virtualization}
                      fallback={
                        <For each={state().visibleOptions}>{(option) => renderOption(option)}</For>
                      }
                    >
                      <div
                        style={{
                          height: `${state().virtualization!.totalHeight}px`,
                          width: '100%',
                          position: 'relative',
                        }}
                      >
                        <For
                          each={state().visibleOptions.slice(
                            state().virtualization!.startIndex,
                            state().virtualization!.endIndex,
                          )}
                        >
                          {(option, idx) => {
                            const actualIndex = () => state().virtualization!.startIndex + idx();
                            return renderOption(option, {
                              position: 'absolute',
                              top: `${actualIndex() * local.itemHeight}px`,
                              height: `${local.itemHeight}px`,
                              width: '100%',
                              'box-sizing': 'border-box',
                            });
                          }}
                        </For>
                      </div>
                    </Show>

                    <Show when={state().canCreate}>
                      <div {...getCreateOptionProps()} class="create-option">
                        + Create "{state().search}"
                      </div>
                    </Show>

                    <Show when={state().visibleOptions.length === 0 && !state().canCreate}>
                      <div class="empty-state">No results found</div>
                    </Show>
                  </>
                }
              >
                <div class="loading-state">Loading...</div>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
