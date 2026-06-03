---
title: defaultFilterOption
description: Performs a case-insensitive search against both the label and value of an option.
---

# defaultFilterOption()

> **defaultFilterOption**(`option`, `search`): `boolean`

Defined in: [utils/options.ts:38](https://github.com/VerbPatch/headless-select/blob/05e0fc46fd0839bef7162ee6e03459cb6f77eafa/packages/headless-select/src/utils/options.ts#L38)

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
