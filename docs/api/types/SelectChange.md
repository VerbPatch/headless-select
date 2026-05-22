---
title: SelectChange
description: Provides details about the type of change and the specific option involved.
---

# SelectChange

> **SelectChange** = `object`

Defined in: [core/types.ts:129](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L129)

Metadata emitted during a selection change event.

## Properties

### option

> **option**: [`SelectOption`](/select/docs/api/types/SelectOption) \| `null`

Defined in: [core/types.ts:137](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L137)

The option involved in the change, or null if it was a clear action.

***

### type

> **type**: `"select"` \| `"deselect"` \| `"clear"` \| `"create"`

Defined in: [core/types.ts:133](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/core/types.ts#L133)

The type of change action performed.
