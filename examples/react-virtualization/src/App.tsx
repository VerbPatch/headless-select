import { useState } from 'react';
import VirtualizedSelect from './VirtualizedSelect';

const options = Array.from({ length: 10000 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}));

function App() {
  const [value, setValue] = useState<string | string[]>(["option-1","option-2","option-3"]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Virtualized Select</h1>
      <p>This example demonstrates 10,000 items with virtualization.</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Single Select
        </label>
        <VirtualizedSelect 
          options={options} 
          placeholder="Select an option..."
          onChange={(val) => console.log('Single Select Change:', val)}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Multiple Select
        </label>
        <VirtualizedSelect 
          options={options} 
          multiple 
          placeholder="Select multiple options..."
          value={value}
          onChange={(val) => {
            console.log('Multiple Select Change:', val);
            setValue(val);
          }}
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <strong>Current Value:</strong> {JSON.stringify(value)}
      </div>
    </div>
  );
}

export default App;
