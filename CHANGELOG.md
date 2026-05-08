# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- **Framework Agnostic Core**: A pure TypeScript engine for managing select state and logic.
- **Unified Wrappers**: Support for React, Vue, Svelte, Preact, SolidJS, jQuery, Lit, Qwik, and Angular.
- **Native-First Architecture**: Mandatory synchronization with real HTML `<select>` elements for accessibility and progressive enhancement.
- **High Performance Virtualization**: Built-in support for efficiently handling 10,000+ items.
- **Infinite Loop Protection**: Guarded synchronization logic between custom UI and native DOM elements.
- **WAI-ARIA Compliance**: Complete set of prop getters for keyboard navigation and screen reader support.
- **Advanced Data Engine**: Automatic flattening of grouped options and support for remote data loading with caching.
- **Controlled & Uncontrolled Modes**: Robust state management compatible with all major framework patterns.
- **Optimized DOM Sync**: Efficient bulk updates to native select elements using DocumentFragments and debouncing.
- **Memory Management**: Comprehensive cleanup and destruction logic across all framework wrappers.
- **Testing**: Extensive unit and integration test suite using Vitest.
