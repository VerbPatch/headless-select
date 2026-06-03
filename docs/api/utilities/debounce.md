---
title: debounce
description: Delays the execution of a function until after a specified period of inactivity.
---

# debounce()

> **debounce**\<`T`\>(`fn`, `delay`): `object`

Defined in: [utils/common.ts:35](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/utils/common.ts#L35)

Creates a debounced version of a function.

## Type Parameters

### T

`T` *extends* `unknown`[]

## Parameters

### fn

(...`args`) => `void`

The function to debounce.

### delay

`number`

The delay in milliseconds.

## Returns

`object`

- An object with `call` and `cancel` methods.

### call

> **call**: (...`args`) => `void`

#### Parameters

##### args

...`T`

#### Returns

`void`

### cancel

> **cancel**: () => `void`

#### Returns

`void`
