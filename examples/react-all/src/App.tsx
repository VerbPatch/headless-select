import { useState } from 'react';
import Select from './Select';

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

function App() {
  const [multiValue, setMultiValue] = useState<string[]>(['apple', 'banana']);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>React Headless Select Showcase</h1>
      <p>Demonstrating various configurations of the React adapter.</p>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Progressive Enhancement</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Native Hydration (Pre-filled via HTML)
          </label>
          <Select multiple placeholder="Select colors...">
            <optgroup label="Colors">
              <option value="red" selected>Red</option>
              <option value="green">Green</option>
              <option value="blue" selected>Blue</option>
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
            placeholder="Pick a fruit" 
            onChange={(val) => console.log('Single Change:', val)}
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
              console.log('Multi Change:', val);
              setMultiValue(val as string[]);
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Searchable & Creatable
          </label>
          <Select 
            searchable 
            creatable 
            options={[
              { value: 'react', label: 'React' },
              { value: 'vue', label: 'Vue' },
              { value: 'svelte', label: 'Svelte' },
            ]} 
            placeholder="Framework..." 
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Remote Loading (Async)
          </label>
          <Select 
            searchable 
            cacheOptions 
            loadOptions={async (search) => {
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
          <Select 
            virtualize
            options={largeList} 
            placeholder="Scroll 10,000 items..." 
          />
        </div>
      </section>

      <section>
        <h2>Controlled vs Uncontrolled</h2>
        <p>Current multi-select value: {JSON.stringify(multiValue)}</p>
        <button onClick={() => setMultiValue(['apple', 'carrot'])}>
          Set to [Apple, Carrot]
        </button>
      </section>
    </div>
  );
}

export default App;
