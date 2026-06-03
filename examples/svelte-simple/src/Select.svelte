<script lang="ts">
  import { useSelect } from '@verbpatch/svelte-select';
  import { onMount, tick, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let options: any[] = [];
  export let multiple = false;
  export let searchable: boolean | undefined = undefined;
  export let creatable = false;
  export let placeholder = 'Select...';
  export let value: string | string[] = '';
  export let virtualize = false;
  export let itemHeight = 35;
  export let containerHeight = 300;
  export let showNative = true;
  export let hideNative = false;
  export let fetchRemoteOptions: ((search: string) => Promise<any[]>) | undefined = undefined;
  export let cacheOptions = false;
  export let defaultOptions: boolean | any[] = false;

  // Render updates count
  let renderUpdates = 1;

  // Setup headless-select hook
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
    getTriggerCallbacks,
    getOptionCallbacks,
    getSearchInputCallbacks,
    getCreateOptionCallbacks,
    getClearOptionCallbacks,
    getOptionLabel,
    getSelectedOptions,
    setConfig,
  } = useSelect({
    options,
    multiple,
    searchable,
    creatable,
    placeholder,
    value,
    virtualize,
    itemHeight,
    containerHeight,
    fetchRemoteOptions,
    cacheOptions,
    defaultOptions,
    onChange: (val) => {
      value = val;
      dispatch('change', val);
    },
  });

  // Keep config in sync with parent properties
  $: setConfig({
    options,
    multiple,
    searchable,
    creatable,
    placeholder,
    value,
    virtualize,
    itemHeight,
    containerHeight,
    fetchRemoteOptions,
    cacheOptions,
    defaultOptions,
  });

  // Track state updates
  $: if ($state) {
    renderUpdates += 1;
  }

  const listboxProps = getListboxProps();

  let listboxRef: HTMLElement;
  $: if (listboxRef && $state.isOpen) {
    tick().then(() => {
      if (listboxRef && listboxRef.scrollTop !== $state.scrollTop) {
        listboxRef.scrollTop = $state.scrollTop;
      }
    });
  }
</script>

<div class="select-container">
  <div class="render-count-badge">
    Render Updates: {renderUpdates}
  </div>

  {#if showNative}
    <div class="native-interface-container {hideNative ? 'hidden' : ''}">
      {#if !hideNative}
        <label for="native-select">Native Select Interface</label>
      {/if}
      <select
        id="native-select"
        use:nativeRef
        {...getNativeSelectProps($state)}
        class="native-select {hideNative ? 'hidden' : 'visible'}"
        style="height: {hideNative ? '1px' : (multiple || virtualize) ? '120px' : 'auto'};"
      >
        <slot />
      </select>
      {#if !hideNative}
        <div class="native-note">
          ↑ Native &lt;select&gt; element. 2-way sync active.
          {#if virtualize}
            (10k items sync might be heavy)
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <div class="custom-ui-wrapper">
    <label for="select-trigger">Headless Custom UI {virtualize ? '(Virtualized)' : ''}</label>
    {#if !showNative}
      <div class="custom-ui-note">
        (Pure Headless - No Native Sync)
      </div>
    {/if}

    <button
      id="select-trigger"
      {...getTriggerProps($state)}
      on:click={getTriggerCallbacks().onClick}
      on:keydown={getTriggerCallbacks().onKeyDown}
      class="select-trigger"
    >
      {#if $state.selectedValues.length > 0}
        {#if multiple}
          <div class="selected-values-container">
            {#each getSelectedOptions($state) as opt (opt.value)}
              <span class="selected-value-pill">
                {opt.label}
                <span
                  {...getClearOptionProps(opt.value, $state)}
                  on:click|stopPropagation={getClearOptionCallbacks(opt.value).onClick}
                  class="selected-value-clear"
                >
                  ×
                </span>
              </span>
            {/each}
          </div>
        {:else}
          {getOptionLabel($state.selectedValues[0], $state)}
        {/if}
      {:else}
        {placeholder || 'Select...'}
      {/if}
    </button>

    {#if $state.isOpen}
      <div class="select-dropdown">
        {#if searchable !== false}
          <div class="search-container">
            <input
              {...getSearchInputProps($state)}
              on:input={getSearchInputCallbacks().onInput}
              on:keydown={getSearchInputCallbacks().onKeyDown}
              class="search-input"
              placeholder={virtualize ? 'Search 10,000 items...' : 'Search options...'}
              autofocus
            />
          </div>
        {/if}

        <div
          {...listboxProps}
          bind:this={listboxRef}
          on:scroll={(e) => instance.onScroll(e.target.scrollTop)}
          class="listbox-container"
          style="max-height: {virtualize ? `${containerHeight}px` : '250px'}; height: {virtualize ? `${containerHeight}px` : 'auto'};"
        >
          {#if $state.isLoading}
            <div class="loading-state">Loading...</div>
          {:else}
            {#if virtualize && $state.virtualization}
              <div style="height: {$state.virtualization.totalHeight}px; width: 100%; position: relative;">
                {#each $state.visibleOptions.slice($state.virtualization.startIndex, $state.virtualization.endIndex) as option, idx (option.value)}
                  {@const actualIndex = $state.virtualization.startIndex + idx}
                  {@const props = getOptionProps(option.value, $state)}
                  {@const callbacks = getOptionCallbacks(option.value)}
                  {@const isFocused = props['data-focused']}
                  {@const isSelected = props['aria-selected']}
                  <div
                    {...props}
                    on:click={callbacks.onClick}
                    on:mouseenter={callbacks.onMouseEnter}
                    class="option-item {isFocused ? 'focused' : ''} {isSelected ? 'selected' : ''} {option.disabled ? 'disabled' : ''}"
                    style="position: absolute; top: {actualIndex * itemHeight}px; height: {itemHeight}px; width: 100%; box-sizing: border-box;"
                  >
                    <span class="option-icon">{isSelected ? '●' : '○'}</span>
                    <div class="option-label-container">
                      <span>{option.label}</span>
                    </div>
                    {#if isFocused}
                      <span class="option-focus-badge">[FOCUS]</span>
                    {/if}
                  </div>
                {/each}
              </div>
            {:else}
              {#each $state.visibleOptions as option (option.value)}
                {@const props = getOptionProps(option.value, $state)}
                {@const callbacks = getOptionCallbacks(option.value)}
                {@const isFocused = props['data-focused']}
                {@const isSelected = props['aria-selected']}
                <div
                  {...props}
                  on:click={callbacks.onClick}
                  on:mouseenter={callbacks.onMouseEnter}
                  class="option-item {isFocused ? 'focused' : ''} {isSelected ? 'selected' : ''} {option.disabled ? 'disabled' : ''}"
                >
                  <span class="option-icon">{isSelected ? '●' : '○'}</span>
                  <div class="option-label-container">
                    <span>{option.label}</span>
                    {#if option.groupLabel}
                      <span class="option-group-label">{option.groupLabel}</span>
                    {/if}
                  </div>
                  {#if isFocused}
                    <span class="option-focus-badge">[FOCUS]</span>
                  {/if}
                </div>
              {/each}
            {/if}

            {#if $state.canCreate}
              <div
                {...getCreateOptionProps($state)}
                on:click={getCreateOptionCallbacks().onClick}
                class="create-option"
              >
                + Create "{$state.search}"
              </div>
            {/if}

            {#if $state.visibleOptions.length === 0 && !$state.canCreate}
              <div class="empty-state">No results found</div>
            {/if}
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
