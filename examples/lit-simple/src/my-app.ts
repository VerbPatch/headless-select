import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import './select-element';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
];

const largeList = Array.from({ length: 10000 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}));

@customElement('my-app')
export class MyApp extends LitElement {
  @state() private multiValue: string[] = ['apple', 'banana'];
  @state() private singleValue: string = 'banana';

  // Reference to the static native <select> used for progressive-enhancement hydration.
  // We query it AFTER first render so we can pass it to <headless-select .hydrateFrom>.
  @query('#hydration-native') private _hydrationNative!: HTMLSelectElement;

  // Track whether we've passed hydrateFrom yet (need one render cycle for the
  // native select to exist in the DOM before we can reference it).
  @state() private _hydrationReady = false;

  override createRenderRoot() {
    return this;
  }

  override firstUpdated() {
    // After first render the #hydration-native <select> exists in the DOM.
    // Trigger a re-render so we can pass it as .hydrateFrom to the component.
    this._hydrationReady = true;
  }

  override render() {
    return html`
      <div style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
        <h1>Lit Headless Select Showcase</h1>
        <p>Demonstrating various configurations of the Lit adapter.</p>

        <!-- ── Progressive Enhancement ──────────────────────────────────── -->
        <section style="margin-bottom: 3rem;">
          <h2>Progressive Enhancement</h2>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Native Hydration (Pre-filled via HTML)
            </label>

            <!--
              The native <select> is rendered here (static HTML).
              After firstUpdated(), we pass it to <headless-select> via .hydrateFrom
              so the headless engine reads the pre-selected <option> tags.
            -->
            <headless-select
              .multiple=${true}
              .hydrateFrom=${this._hydrationReady ? this._hydrationNative : undefined}
              placeholder="Select colors..."
            >
            </headless-select>

            <!-- This native select is the source of truth for hydration.
                 It's rendered once and remains stable in the DOM. -->
            <select id="hydration-native" multiple style="display:none;">
              <optgroup label="Colors">
                <option value="red" selected>Red</option>
                <option value="green">Green</option>
                <option value="blue" selected>Blue</option>
              </optgroup>
            </select>

            <div style="font-size: 11px; color: #666; margin-top: 8px;">
              Notice: The Headless UI above is automatically populated and synchronized from the
              standard <code>&lt;option&gt;</code> tags defined in the source code.
            </div>
          </div>
        </section>

        <!-- ── Standard Selects ──────────────────────────────────────────── -->
        <section style="margin-bottom: 3rem;">
          <h2>Standard Selects</h2>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Basic Single Select
            </label>
            <headless-select
              .options=${fruitOptions}
              .value=${this.singleValue}
              placeholder="Pick a fruit"
              .searchable=${true}
              @change=${(e: CustomEvent) => (this.singleValue = e.detail)}
            ></headless-select>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Multiple Select with Groups
            </label>
            <headless-select
              .multiple=${true}
              .options=${groupedOptions}
              placeholder="Select food..."
              .searchable=${true}
              .value=${this.multiValue}
              @change=${(e: CustomEvent) => (this.multiValue = e.detail)}
            ></headless-select>
            <div
              style="margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 4px; border: 1px solid #eee; color: #333;"
            >
              <h4 style="margin: 0 0 0.5rem 0;">Controlled State Management</h4>
              <p style="margin: 0 0 1rem 0; font-size: 13px; color: #666;">
                Current multi-select value: <code>${JSON.stringify(this.multiValue)}</code>
              </p>
              <button
                @click=${() => (this.multiValue = ['apple', 'carrot'])}
                style="padding: 4px 12px; cursor: pointer;"
              >
                Force Set to [Apple, Carrot]
              </button>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Searchable &amp; Creatable (Native Hidden)
            </label>
            <headless-select
              .searchable=${true}
              .creatable=${true}
              .hideNative=${true}
              .options=${[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'svelte', label: 'Svelte' },
              ]}
              placeholder="Framework..."
            ></headless-select>
            <div style="font-size: 11px; color: #666; margin-top: 8px;">
              Notice: The native <code>&lt;select&gt;</code> is present in the DOM but visually
              hidden (using <code>hideNative</code>). Synchronization and validation still work
              perfectly in the background.
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Remote Loading (Async)
            </label>
            <headless-select
              .searchable=${true}
              .cacheOptions=${true}
              .fetchRemoteOptions=${async (search: string) => {
                if (!search) return [];
                const res = await fetch('https://jsonplaceholder.typicode.com/users');
                const users = await res.json();
                return users
                  .filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()))
                  .map((u: any) => ({ value: String(u.id), label: u.name }));
              }}
              placeholder="Search users..."
            ></headless-select>
          </div>
        </section>

        <!-- ── Performance ────────────────────────────────────────────────── -->
        <section style="margin-bottom: 3rem;">
          <h2>Performance</h2>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Virtualized Select (10,000 items)
            </label>
            <headless-select
              .virtualize=${true}
              .options=${largeList}
              placeholder="Scroll 10,000 items..."
            ></headless-select>
          </div>
        </section>

        <!-- ── Core Engine ─────────────────────────────────────────────────── -->
        <section style="margin-bottom: 3rem;">
          <h2>Core Engine</h2>
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
              Pure Headless (No Native Element)
            </label>
            <headless-select
              .showNative=${false}
              .options=${[
                { value: 'logic', label: 'Logic Only' },
                { value: 'state', label: 'State Management' },
                { value: 'headless', label: 'No DOM Sync' },
              ]}
              placeholder="Select engine mode..."
            ></headless-select>
            <div style="font-size: 11px; color: #666; margin-top: 8px;">
              Notice: There is no native <code>&lt;select&gt;</code> element here. The library is
              operating as a standalone logic engine.
            </div>
          </div>
        </section>
      </div>
    `;
  }
}
