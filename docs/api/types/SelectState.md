---
title: SelectState
description: Holds all reactive state for the select, including visibility, search term, and selections.
---

# SelectState

Defined in: [core/types.ts:74](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L74)

Represents the internal state of a select instance.

## Properties

### canCreate

> **canCreate**: `boolean`

Defined in: [core/types.ts:102](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L102)

Whether the "Create" option should be displayed based on current search.

***

### error

> **error**: `Error` \| `null`

Defined in: [core/types.ts:110](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L110)

Any error that occurred during data fetching or state transitions.

***

### focusedOptionValue

> **focusedOptionValue**: `string` \| `null`

Defined in: [core/types.ts:98](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L98)

The value of the option currently focused via keyboard navigation.

***

### isLoading

> **isLoading**: `boolean`

Defined in: [core/types.ts:106](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L106)

Whether an asynchronous load operation is currently in progress.

***

### isOpen

> **isOpen**: `boolean`

Defined in: [core/types.ts:78](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L78)

Whether the dropdown menu is currently open.

***

### resolvedOptions

> **resolvedOptions**: [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:90](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L90)

All resolved options after processing groups and asynchronous loading.

***

### search

> **search**: `string`

Defined in: [core/types.ts:82](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L82)

The current search string typed by the user.

***

### selectedValues

> **selectedValues**: `string`[]

Defined in: [core/types.ts:86](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L86)

The list of currently selected values.

***

### virtualization?

> `optional` **virtualization?**: `object`

Defined in: [core/types.ts:114](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L114)

Current virtualization window and calculations.

#### endIndex

> **endIndex**: `number`

#### items

> **items**: `object`[]

#### offsetY

> **offsetY**: `number`

#### startIndex

> **startIndex**: `number`

#### totalHeight

> **totalHeight**: `number`

***

### visibleOptions

> **visibleOptions**: [`SelectOption`](/select/docs/api/types/SelectOption)[]

Defined in: [core/types.ts:94](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L94)

The subset of options currently visible in the dropdown (filtered by search).
