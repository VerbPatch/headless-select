---
title: calculateVirtualization
description: Determines which subset of items should be rendered based on scroll position and container height.
---

# calculateVirtualization()

> **calculateVirtualization**(`itemCount`, `itemHeight`, `containerHeight`, `scrollTop`, `overscan?`): [`VirtualizationState`](/select/docs/api/types/VirtualizationState)

Defined in: [features/virtualization.ts:38](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/features/virtualization.ts#L38)

Calculates the virtualization window for a scrollable list.

## Parameters

### itemCount

`number`

Total number of items in the list.

### itemHeight

`number`

Fixed height of a single item in pixels.

### containerHeight

`number`

Height of the visible scroll container in pixels.

### scrollTop

`number`

Current scroll top position of the container.

### overscan?

`number` = `5`

Number of extra items to render outside the visible area.

## Returns

[`VirtualizationState`](/select/docs/api/types/VirtualizationState)

- The calculated virtualization state.
