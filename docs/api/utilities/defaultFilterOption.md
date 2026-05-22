---
title: defaultFilterOption
description: Performs a case-insensitive search against both the label and value of an option.
---

# defaultFilterOption()

> **defaultFilterOption**(`option`, `search`): `boolean`

Defined in: [utils/options.ts:36](https://github.com/VerbPatch/headless-select/blob/85f1448fcd20f7bef067bfd4e4f36ac142b65c42/packages/headless-select/src/utils/options.ts#L36)

The default filtering logic used when no custom filter is provided.

## Parameters

### option

[`SelectOption`](/select/docs/api/types/SelectOption)

The option to test.

### search

`string`

The search term to match against.

## Returns

`boolean`

- True if the option matches the search term.
