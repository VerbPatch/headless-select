import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Select } from './Select';

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

export function App() {
  const [multiValue, setMultiValue] = useState<string[]>(['apple', 'banana']);
  const [singleValue, setSingleValue] = useState<string>('banana');

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Preact Headless Select Showcase</h1>
      <p>Demonstrating various configurations of the Preact adapter.</p>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Progressive Enhancement</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Native Hydration (Pre-filled via HTML)
          </label>
          <Select multiple placeholder="Select colors..." hideNative={false}>
            <optgroup label="Colors">
              <option value="red" selected>
                Red
              </option>
              <option value="green">Green</option>
              <option value="blue" selected>
                Blue
              </option>
            </optgroup>
          </Select>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
            Notice: The Headless UI above is automatically populated and synchronized from the
            standard <code>&lt;option&gt;</code> tags defined in the source code.
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Standard Selects</h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Basic Single Select
          </label>
          <Select
            options={fruitOptions}
            value={singleValue}
            placeholder="Pick a fruit"
            onChange={(val) => {
              setSingleValue(val as string);
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Multiple Select with Groups
          </label>
          <Select
            multiple
            options={groupedOptions}
            placeholder="Select food..."
            value={multiValue}
            onChange={(val) => {
              setMultiValue(val as string[]);
            }}
          />
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #eee',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Controlled State Management</h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#666' }}>
              Current multi-select value: <code>{JSON.stringify(multiValue)}</code>
            </p>
            <button
              onClick={() => setMultiValue(['apple', 'carrot'])}
              style={{ padding: '4px 12px', cursor: 'pointer' }}
            >
              Force Set to [Apple, Carrot]
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Searchable & Creatable (Native Hidden)
          </label>
          <Select
            searchable
            creatable
            hideNative
            options={[
              { value: 'react', label: 'React' },
              { value: 'vue', label: 'Vue' },
              { value: 'svelte', label: 'Svelte' },
            ]}
            placeholder="Framework..."
          />
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
            Notice: The native <code>&lt;select&gt;</code> is present in the DOM but visually hidden
            (using <code>hideNative</code>). Synchronization and validation still work perfectly in
            the background.
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Remote Loading (Async)
          </label>
          <Select
            searchable
            cacheOptions
            fetchRemoteOptions={async (search) => {
              if (!search) return [];
              const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
              const users = await res.json();
              return users
                .filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()))
                .map((u: any) => ({ value: String(u.id), label: u.name }));
            }}
            placeholder="Search users..."
          />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Performance</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Virtualized Select (10,000 items)
          </label>
          <Select virtualize options={largeList} placeholder="Scroll 10,000 items..." />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Core Engine</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Pure Headless (No Native Element)
          </label>
          <Select
            showNative={false}
            options={[
              { value: 'logic', label: 'Logic Only' },
              { value: 'state', label: 'State Management' },
              { value: 'headless', label: 'No DOM Sync' },
            ]}
            placeholder="Select engine mode..."
          />
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
            Notice: There is no native <code>&lt;select&gt;</code> element here. The library is
            operating as a standalone logic engine.
          </div>
        </div>
      </section>
    </div>
  );
}
