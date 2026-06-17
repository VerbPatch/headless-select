import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import { SelectController } from '@verbpatch/lit-select';

@customElement('headless-select')
export class HeadlessSelect extends LitElement {
  // ── Display props ─────────────────────────────────────────────────────────
  @property({ type: Boolean }) virtualize = false;
  @property({ type: Number }) itemHeight = 35;
  @property({ type: Number }) containerHeight = 300;
  /** Show the native <select> panel alongside the custom UI (default true) */
  @property({ type: Boolean }) showNative = true;
  /** Visually hide the native <select> but keep it in DOM for form sync */
  @property({ type: Boolean }) hideNative = false;

  // ── Select config props ───────────────────────────────────────────────────
  @property({ type: Array }) options?: any[];
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean }) searchable = false;
  @property({ type: Boolean }) creatable = false;
  @property({ type: String }) placeholder = 'Select...';
  @property({ type: Object }) value?: any;
  @property({ type: Function }) fetchRemoteOptions?: (search: string) => Promise<any[]>;
  @property({ type: Boolean }) cacheOptions?: boolean;
  /**
   * External HTMLSelectElement to hydrate from (progressive enhancement).
   * The core reads its options + pre-selected values to seed the headless state.
   * The rendered visible native select is managed separately by this component.
   */
  @property({ type: Object }) hydrateFrom?: HTMLSelectElement;

  // ── Internal ──────────────────────────────────────────────────────────────
  @state() private _renderCount = 0;

  private _ctrl!: SelectController;
  private _isScrolling = false;
  private _scrollTimer?: ReturnType<typeof setTimeout>;

  // Stable ref to the rendered <select> inside this component
  private _nativeRef: Ref<HTMLSelectElement> = createRef();
  // Whether we have attached the 'change' listener on the rendered native select
  private _nativeListenerAttached = false;

  override createRenderRoot() {
    return this; // light DOM — global CSS applies
  }

  override connectedCallback() {
    super.connectedCallback();
    this._ctrl = new SelectController(this, {
      options: this.options,
      multiple: this.multiple,
      searchable: this.searchable,
      creatable: this.creatable,
      placeholder: this.placeholder,
      value: this.value,
      fetchRemoteOptions: this.fetchRemoteOptions,
      cacheOptions: this.cacheOptions,
      // Wire the external select (if any) so the core reads pre-selected values.
      // We do NOT wire the rendered native select to hydrateFrom — we sync it
      // manually in updated() to avoid core's el.innerHTML='' conflicting with
      // Lit's DOM management.
      hydrateFrom: this.hydrateFrom,
      onChange: (val) => {
        this.dispatchEvent(new CustomEvent('change', { detail: val }));
      },
    });
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (!this._ctrl) return;

    const configKeys = [
      'options',
      'multiple',
      'searchable',
      'creatable',
      'placeholder',
      'value',
      'fetchRemoteOptions',
      'cacheOptions',
    ] as const;

    if (configKeys.some((k) => changed.has(k))) {
      this._ctrl.updateConfig({
        options: this.options,
        multiple: this.multiple,
        searchable: this.searchable,
        creatable: this.creatable,
        placeholder: this.placeholder,
        value: this.value,
        fetchRemoteOptions: this.fetchRemoteOptions,
        cacheOptions: this.cacheOptions,
      });
    }

    if (changed.has('hydrateFrom')) {
      this._ctrl.updateConfig({ hydrateFrom: this.hydrateFrom });
    }
  }

  override updated() {
    if (!this.showNative) return;
    const nativeSel = this._nativeRef.value;
    if (!nativeSel) return;

    // Always imperatively sync the rendered native select from headless state.
    // We NEVER pass the rendered native select as hydrateFrom — that would let
    // the core call el.innerHTML='' and destroy our DOM.  Instead we own the
    // rendered native select completely: write to it here, read from it via a
    // 'change' listener below.
    this._syncNativeSelectOptions(nativeSel);

    // Attach the 'change' listener once so that user interactions with the
    // rendered native select are propagated back into the headless state.
    if (!this._nativeListenerAttached) {
      this._nativeListenerAttached = true;
      nativeSel.addEventListener('change', () => {
        this._onNativeChange(nativeSel);
      });
    }
  }

  /**
   * Imperatively write options + selected state from headless state into the
   * rendered native <select>.  Rebuilds option elements only when necessary.
   */
  private _syncNativeSelectOptions(nativeSel: HTMLSelectElement) {
    const state = this._ctrl.state;
    const resolvedOptions = state.resolvedOptions ?? [];
    const selectedValues = new Set(state.selectedValues);

    // Check whether a full rebuild is needed
    let needsRebuild = nativeSel.options.length !== resolvedOptions.length;
    if (!needsRebuild) {
      for (let i = 0; i < resolvedOptions.length; i++) {
        if (nativeSel.options[i]?.value !== resolvedOptions[i].value) {
          needsRebuild = true;
          break;
        }
      }
    }

    if (needsRebuild) {
      // Rebuild options imperatively (no Lit template → no ChildPart conflict)
      const fragment = document.createDocumentFragment();
      resolvedOptions.forEach((opt) => {
        const el = new Option(opt.label, opt.value, false, selectedValues.has(opt.value));
        if (opt.disabled) el.disabled = true;
        fragment.appendChild(el);
      });
      // Replace contents without triggering Lit ChildPart errors
      nativeSel.innerHTML = '';
      nativeSel.appendChild(fragment);
    } else {
      // Just update selected state — no structural change needed
      Array.from(nativeSel.options).forEach((el) => {
        el.selected = selectedValues.has(el.value);
      });
    }
  }

  /**
   * Called when the user changes the rendered native <select>.
   * Syncs the new selection back into the headless state.
   */
  private _onNativeChange(nativeSel: HTMLSelectElement) {
    const newValues = Array.from(nativeSel.selectedOptions).map((o) => o.value);
    const current = this._ctrl.state.selectedValues;

    const added = newValues.filter((v) => !current.includes(v));
    const removed = current.filter((v) => !newValues.includes(v));

    if (!this.multiple) {
      if (added.length > 0) {
        this._ctrl.instance.selectOption(added[0]);
      } else if (newValues.length === 0) {
        this._ctrl.instance.clearAll();
      }
    } else {
      added.forEach((v) => this._ctrl.instance.selectOption(v));
      removed.forEach((v) => this._ctrl.instance.deselectOption(v));
    }
  }

  private _handleScroll(e: Event) {
    this._isScrolling = true;
    if (this._scrollTimer) clearTimeout(this._scrollTimer);
    this._scrollTimer = setTimeout(() => {
      this._isScrolling = false;
    }, 150);
    this._ctrl.instance.onScroll((e.target as HTMLElement).scrollTop);
  }

  private _renderOption(option: any, style: Record<string, string> = {}) {
    const instance = this._ctrl.instance;
    const optProps = instance.getOptionProps(option.value);
    const isFocused = optProps['data-focused'];
    const isSelected = optProps['aria-selected'];

    const classes = [
      'option-item',
      isFocused && 'focused',
      isSelected && 'selected',
      option.disabled && 'disabled',
    ]
      .filter(Boolean)
      .join(' ');

    const styleStr = Object.entries(style)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');

    return html`
      <div
        id=${optProps.id}
        role=${optProps.role}
        aria-selected=${String(isSelected)}
        class=${classes}
        style=${styleStr}
        @click=${(e: Event) => {
          e.preventDefault();
          if (!optProps['aria-disabled']) optProps.onClick(e as any);
        }}
        @pointerenter=${this._isScrolling
          ? null
          : () => {
              if (!optProps['aria-disabled']) optProps.onMouseEnter();
            }}
      >
        <span class="option-icon">${isSelected ? '●' : '○'}</span>
        <div class="option-label-container">
          <span>${option.label}</span>
          ${option.groupLabel && !this.virtualize
            ? html`<span class="option-group-label">${option.groupLabel}</span>`
            : ''}
        </div>
        ${isFocused ? html`<span class="option-focus-badge">[FOCUS]</span>` : ''}
      </div>
    `;
  }

  override render() {
    this._renderCount++;
    if (!this._ctrl) return html``;

    const state = this._ctrl.state;
    const instance = this._ctrl.instance;

    const nativeHeight = this.hideNative
      ? '1px'
      : this.multiple || this.virtualize
        ? '120px'
        : 'auto';

    return html`
      <div class="select-container">
        <div class="render-count-badge">Render Count: ${this._renderCount}</div>

        ${this.showNative
          ? html`
              <div class="native-interface-container ${this.hideNative ? 'hidden' : ''}">
                ${!this.hideNative ? html`<label>Native Select Interface</label>` : ''}

                <!--
                  The <select> is intentionally left childless in the Lit template.
                  Options are written imperatively by _syncNativeSelectOptions() in
                  updated() — this avoids creating Lit ChildParts inside the <select>
                  which would conflict with our own innerHTML manipulation.
                -->
                <select
                  ${ref(this._nativeRef)}
                  class="native-select ${this.hideNative ? 'hidden' : 'visible'}"
                  style="height:${nativeHeight};"
                  ?multiple=${this.multiple}
                ></select>

                ${!this.hideNative
                  ? html`
                      <div class="native-note">
                        ↑ Native &lt;select&gt; element. 2-way sync active.
                        ${this.virtualize ? ' (10k items sync might be heavy)' : ''}
                      </div>
                    `
                  : ''}
              </div>
            `
          : ''}

        <div class="custom-ui-wrapper">
          <label>Headless Custom UI${this.virtualize ? ' (Virtualized)' : ''}</label>
          ${!this.showNative
            ? html`<div class="custom-ui-note">(Pure Headless - No Native Sync)</div>`
            : ''}

          <button
            class="select-trigger"
            @click=${() => instance.toggle()}
            @keydown=${(e: KeyboardEvent) => instance.handleKeyDown(e)}
            aria-haspopup="listbox"
            aria-expanded=${String(state.isOpen)}
          >
            ${state.selectedValues.length > 0
              ? this.multiple
                ? html`
                    <div class="selected-values-container">
                      ${instance.getSelectedOptions().map(
                        (opt) => html`
                          <span class="selected-value-pill">
                            ${opt.label}
                            <span
                              class="selected-value-clear"
                              @click=${(e: Event) => {
                                e.stopPropagation();
                                instance.deselectOption(opt.value);
                              }}
                              >×</span
                            >
                          </span>
                        `,
                      )}
                    </div>
                  `
                : html`${instance.getOptionLabel(state.selectedValues[0])}`
              : html`${this.placeholder}`}
          </button>

          ${state.isOpen
            ? html`
                <div class="select-dropdown">
                  ${this.searchable
                    ? html`
                        <div class="search-container">
                          <input
                            class="search-input"
                            type="text"
                            .value=${state.search}
                            placeholder=${this.virtualize
                              ? 'Search 10,000 items...'
                              : 'Search options...'}
                            @input=${(e: Event) =>
                              instance.setSearch((e.target as HTMLInputElement).value)}
                            @keydown=${(e: KeyboardEvent) => instance.handleKeyDown(e)}
                            autofocus
                          />
                        </div>
                      `
                    : ''}

                  <div
                    class="listbox-container"
                    role="listbox"
                    @scroll=${this._handleScroll.bind(this)}
                    style="max-height:${this.virtualize
                      ? `${this.containerHeight}px`
                      : '250px'};height:${this.virtualize
                      ? `${this.containerHeight}px`
                      : 'auto'};overflow-y:auto;position:relative;"
                  >
                    ${state.isLoading
                      ? html`<div class="loading-state">Loading...</div>`
                      : this.virtualize && state.virtualization
                        ? html`
                            <div
                              style="height:${state.virtualization
                                .totalHeight}px;width:100%;position:relative;"
                            >
                              ${state.visibleOptions
                                .slice(
                                  state.virtualization.startIndex,
                                  state.virtualization.endIndex,
                                )
                                .map((option, idx) => {
                                  const actualIndex = state.virtualization!.startIndex + idx;
                                  return this._renderOption(option, {
                                    position: 'absolute',
                                    top: `${actualIndex * this.itemHeight}px`,
                                    height: `${this.itemHeight}px`,
                                    width: '100%',
                                    'box-sizing': 'border-box',
                                  });
                                })}
                            </div>
                          `
                        : html`
                            ${state.visibleOptions.map((option) => this._renderOption(option))}
                            ${state.canCreate
                              ? html`
                                  <div
                                    class="create-option"
                                    @click=${() => instance.createOption(state.search)}
                                  >
                                    + Create "${state.search}"
                                  </div>
                                `
                              : ''}
                            ${state.visibleOptions.length === 0 && !state.canCreate
                              ? html`<div class="empty-state">No results found</div>`
                              : ''}
                          `}
                  </div>
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}
