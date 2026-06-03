---
title: SelectChange
description: Provides details about the type of change and the specific option involved.
---

# SelectChange

> **SelectChange** = `object`

Defined in: [core/types.ts:132](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L132)

Metadata emitted during a selection change event.

## Properties

### option

> **option**: [`SelectOption`](/select/docs/api/types/SelectOption) \| `null`

Defined in: [core/types.ts:140](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L140)

The option involved in the change, or null if it was a clear action.

***

### type

> **type**: `"select"` \| `"deselect"` \| `"clear"` \| `"create"`

Defined in: [core/types.ts:136](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/core/types.ts#L136)

The type of change action performed.
