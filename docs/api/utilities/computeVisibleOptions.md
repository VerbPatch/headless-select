---
title: computeVisibleOptions
description: A high-level utility that resolves the filter function and applies it to the current options.
---

# computeVisibleOptions()

> **computeVisibleOptions**(`config`, `resolved`, `search`, `selectedValues`): [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [utils/options.ts:92](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/utils/options.ts#L92)

Computes the final set of visible options based on the current configuration and state.

## Parameters

### config

[`SelectConfig`](/select/docs/api/types/SelectConfig)

The select configuration.

### resolved

[`SelectOption`](/select/docs/api/types/SelectOption)[]

The full set of resolved options.

### search

`string`

The current search term.

### selectedValues

`string`[]

The currently selected values.

## Returns

[`SelectOption`](/select/docs/api/types/SelectOption)[]

- The options that should be visible in the dropdown.
