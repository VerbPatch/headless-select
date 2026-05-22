---
title: nextFocusableIndex
description: Navigates through the options list to find the next available option that is not disabled, supporting circular wrapping.
---

# nextFocusableIndex()

> **nextFocusableIndex**(`options`, `currentValue`, `direction`): `string` \| `null`

Defined in: [utils/options.ts:140](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/utils/options.ts#L140)

Calculates the next or previous focusable index in the options list.

## Parameters

### options

[`SelectOption`](/select/docs/api/types/SelectOption)[]

The list of options to navigate.

### currentValue

`string` \| `null`

The value of the currently focused option.

### direction

`-1` \| `1`

The direction to move (1 for next, -1 for previous).

## Returns

`string` \| `null`

- The value of the next focusable option.
