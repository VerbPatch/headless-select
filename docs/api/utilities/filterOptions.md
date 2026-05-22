---
title: filterOptions
description: Orchestrates the filtering process for a list of options.
---

# filterOptions()

> **filterOptions**(`options`, `search`, `filterFn`, `_selectedValues`, `_multiple`): [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [utils/options.ts:55](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/utils/options.ts#L55)

Filters a flat list of options based on a search term and filter function.

## Parameters

### options

[`SelectOption`](/select/docs/api/types/SelectOption)[]

The flat list of options to filter.

### search

`string`

The current search term.

### filterFn

(`option`, `search`) => `boolean`

The function used to test each option.

### \_selectedValues

`string`[]

Current selected values (reserved for future use).

### \_multiple

`boolean`

Whether multiple selection is enabled (reserved for future use).

## Returns

[`SelectOption`](/select/docs/api/types/SelectOption)[]

- The filtered list of options.
