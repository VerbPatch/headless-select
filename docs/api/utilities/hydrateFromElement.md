---
title: hydrateFromElement
description: |-
  Scans a native 
   element for its options and 
   children, extracting values, labels, and disabled states.
---

# hydrateFromElement()

> **hydrateFromElement**(`element`): `object`

Defined in: [utils/hydration.ts:11](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/utils/hydration.ts#L11)

Hydrates options and values from a native HTML select element.

## Parameters

### element

`HTMLSelectElement`

The native select element to hydrate from.

## Returns

`object`

- An object containing the extracted options, selected values, and multiple-selection mode.

### multiple

> **multiple**: `boolean`

### options

> **options**: [`DataItem`](/select/docs/api/types/DataItem)[]

### selectedValues

> **selectedValues**: `string`[]
