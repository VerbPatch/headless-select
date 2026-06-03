---
title: calculatePosition
description: Computes top, left, and width while handling viewport collisions and flipping placement if space is restricted.
---

# calculatePosition()

> **calculatePosition**(`trigger`, `menu`, `options?`): [`Position`](/select/docs/api/types/Position)

Defined in: [features/positioning.ts:36](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/features/positioning.ts#L36)

Calculates the optimal position for the dropdown menu relative to its trigger.

## Parameters

### trigger

`HTMLElement`

The reference element (trigger).

### menu

`HTMLElement`

The element to be positioned (dropdown).

### options?

Configuration for placement, strategy, and offset.

#### offset?

`number`

#### placement?

`"top"` \| `"bottom"`

#### strategy?

`"absolute"` \| `"fixed"`

## Returns

[`Position`](/select/docs/api/types/Position)

- The calculated position and placement metadata.
