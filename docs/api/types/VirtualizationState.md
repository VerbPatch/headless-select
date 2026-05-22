---
title: VirtualizationState
description: Contains the range of items to render and their positioning within the scrollable container.
---

# VirtualizationState

Defined in: [features/virtualization.ts:7](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/features/virtualization.ts#L7)

Represents the current state of the list virtualization.

## Properties

### endIndex

> **endIndex**: `number`

Defined in: [features/virtualization.ts:15](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/features/virtualization.ts#L15)

Index of the last item to render (exclusive).

***

### items

> **items**: `object`[]

Defined in: [features/virtualization.ts:27](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/features/virtualization.ts#L27)

List of items currently in the virtualization window with their calculated top positions.

#### index

> **index**: `number`

#### top

> **top**: `number`

***

### offsetY

> **offsetY**: `number`

Defined in: [features/virtualization.ts:23](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/features/virtualization.ts#L23)

Vertical offset for the rendered items container.

***

### startIndex

> **startIndex**: `number`

Defined in: [features/virtualization.ts:11](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/features/virtualization.ts#L11)

Index of the first item to render.

***

### totalHeight

> **totalHeight**: `number`

Defined in: [features/virtualization.ts:19](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/features/virtualization.ts#L19)

Total estimated height of the scrollable content.
