# 📑 Headless Select

A powerful, flexible, and completely headless select library with a universal data engine and advanced interaction logic. Built with TypeScript, designed to work with any UI framework or design system.

[![npm version](https://img.shields.io/npm/v/@verbpatch/headless-select.svg)](https://www.npmjs.com/package/@verbpatch/headless-select)
[![license](https://img.shields.io/npm/l/@verbpatch/headless-select.svg)](https://github.com/verbpatch/headless-select/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## ✨ Features

- 🎯 **Completely Headless** - No UI components, just pure logic and state management.
- 🏗️ **Native-First Architecture** - Mandatory integration with real HTML `<select>` elements for maximum compatibility and progressive enhancement.
- ⚡ **Universal Data Engine** - Effortlessly manage local and remote data sources with built-in caching.
- 🔍 **Advanced Search & Filtering** - Built-in debounced remote loading and flexible filtering logic.
- 🎨 **Framework Agnostic** - Stable wrappers for React, Vue, Svelte, Preact, SolidJS, jQuery, Lit, and Qwik.
- ⌨️ **Keyboard Navigation** - Full WAI-ARIA compliant keyboard interaction logic out of the box.
- 🚀 **Performance Optimized** - Efficiently handles 10,000+ items with built-in virtualization support.
- 🔄 **Two-Way Synchronization** - Automatic sync between your custom UI and the native select element.
- 📦 **Zero Dependencies** - Core engine is lightweight and self-contained.

## 🚀 Installation

Install the core engine and the relevant wrapper for your framework.

```bash
# Core Engine
npm install @verbpatch/headless-select

# Framework Wrappers
npm install @verbpatch/react-select
npm install @verbpatch/vuejs-select
npm install @verbpatch/svelte-select
npm install @verbpatch/preact-select
npm install @verbpatch/solidjs-select
```

## 🪁 Basic Usage (React)

Headless Select **requires** a native select element to function. This ensures your component works perfectly with forms, screen readers, and browser autofill.

```tsx
import { useRef } from 'react';
import { useSelect } from "@verbpatch/react-select";

function MySelect() {
  const nativeRef = useRef<HTMLSelectElement>(null);
  
  const { state, getTriggerProps, getOptionProps, instance } = useSelect({
    hydrateFrom: nativeRef.current!, // Mandatory
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
    onChange: (value) => console.log('Selected:', value),
  });

  return (
    <div className="select-wrapper">
      {/* 1. Render a hidden native select */}
      <select ref={nativeRef} style={{ display: 'none' }} />

      {/* 2. Build your custom UI */}
      <button {...getTriggerProps()} className="trigger">
        {state.selectedValues[0] || 'Select an option'}
      </button>
      
      {state.isOpen && (
        <ul className="dropdown">
          {state.visibleOptions.map((opt) => (
            <li key={opt.value} {...getOptionProps(opt.value)}>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🏗️ Core Architecture

### **The Native Select Requirement**
Unlike other headless libraries, Headless Select mandates the presence of a real HTML `<select>` element. This "Native-First" approach provides:
- **Progressive Enhancement**: Your form works even if JavaScript fails.
- **Accessibility**: Standard browser behaviors are preserved.
- **Interoperability**: Works seamlessly with form libraries like Formik or React Hook Form.

### **Universal Data Engine**
The library includes a sophisticated data engine that handles:
- **Flattening**: Grouped options are automatically flattened for the UI.
- **Caching**: Async results are cached to prevent redundant network requests.
- **Search Logic**: Customizable filtering that works across all frameworks.

## ⌨️ Accessibility (WAI-ARIA)

Headless Select provides all the necessary ARIA attributes and keyboard handlers via "Prop Getters":
- `getTriggerProps()`: Manages `aria-haspopup`, `aria-expanded`, and `onKeyDown`.
- `getListboxProps()`: Manages `role="listbox"` and `aria-multiselectable`.
- `getOptionProps(value)`: Manages `role="option"`, `aria-selected`, and focus states.

## 🛠️ Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the **LGPL-3.0-or-later** - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://www.verbpatch.com/select)
- [GitHub Repository](https://github.com/verbpatch/headless-select)
- [Issue Tracker](https://github.com/verbpatch/headless-select/issues)
